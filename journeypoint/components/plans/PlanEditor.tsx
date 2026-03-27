"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import {
    Alert,
    Button,
    Card,
    Empty,
    Input,
    InputNumber,
    Space,
    Spin,
    Typography,
    message,
} from "antd";
import {
    CopyOutlined,
    ImportOutlined,
    PlusOutlined,
    RollbackOutlined,
    SaveOutlined,
    SendOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {
    APP_ROUTES,
    buildFacilitatorPlanRoute,
} from "@/constants/auth/routes";
import DocumentUploadPanel from "@/components/plans/DocumentUploadPanel";
import ModulePanel from "@/components/plans/ModulePanel";
import TaskFormModal from "@/components/plans/TaskFormModal";
import { useStyles } from "@/components/plans/style/style";
import {
    ICreateOnboardingPlanRequest,
    IOnboardingPlanDraft,
    IOnboardingTaskDraft,
    IOnboardingTaskEditorValues,
    IUpdateOnboardingPlanRequest,
    ONBOARDING_PLAN_STATUS_LABELS,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import {
    useOnboardingPlanActions,
    useOnboardingPlanState,
} from "@/providers/onboardingPlanProvider";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

const buildCreateRequest = (
    draftPlan: IOnboardingPlanDraft,
): ICreateOnboardingPlanRequest => ({
    name: draftPlan.name.trim(),
    description: draftPlan.description.trim(),
    targetAudience: draftPlan.targetAudience.trim(),
    durationDays: draftPlan.durationDays,
    modules: draftPlan.modules.map((module) => ({
        id: module.id ?? null,
        name: module.name.trim(),
        description: module.description.trim(),
        orderIndex: module.orderIndex,
        tasks: module.tasks.map((task) => ({
            id: task.id ?? null,
            title: task.title.trim(),
            description: task.description.trim(),
            category: task.category,
            orderIndex: task.orderIndex,
            dueDayOffset: task.dueDayOffset,
            assignmentTarget: task.assignmentTarget,
            acknowledgementRule: task.acknowledgementRule,
        })),
    })),
});

const buildUpdateRequest = (
    draftPlan: IOnboardingPlanDraft,
): IUpdateOnboardingPlanRequest => ({
    id: draftPlan.id ?? "",
    ...buildCreateRequest(draftPlan),
});

const validateDraftForSave = (draftPlan: IOnboardingPlanDraft): string | null => {
    if (!draftPlan.name.trim()) {
        return "Plan name is required.";
    }

    if (!draftPlan.description.trim()) {
        return "Plan description is required.";
    }

    if (!draftPlan.targetAudience.trim()) {
        return "Target audience is required.";
    }

    if (draftPlan.durationDays < 1) {
        return "Duration must be at least one day.";
    }

    const moduleWithoutName = draftPlan.modules.find((module) => !module.name.trim());
    if (moduleWithoutName) {
        return "Each module must have a name before the plan can be saved.";
    }

    const moduleWithoutDescription = draftPlan.modules.find(
        (module) => !module.description.trim(),
    );
    if (moduleWithoutDescription) {
        return "Each module must have a description before the plan can be saved.";
    }

    const invalidTask = draftPlan.modules
        .flatMap((module) => module.tasks)
        .find((task) => !task.title.trim() || !task.description.trim());

    if (invalidTask) {
        return "Each task must have both a title and description before the plan can be saved.";
    }

    return null;
};

const validateDraftForPublish = (
    draftPlan: IOnboardingPlanDraft,
): string | null => {
    const saveValidationError = validateDraftForSave(draftPlan);

    if (saveValidationError) {
        return saveValidationError;
    }

    if (draftPlan.modules.length === 0) {
        return "Add at least one module before publishing.";
    }

    const emptyModule = draftPlan.modules.find((module) => module.tasks.length === 0);
    if (emptyModule) {
        return "Each module must contain at least one task before publishing.";
    }

    return null;
};

const findDraftTask = (
    draftPlan: IOnboardingPlanDraft | null | undefined,
    moduleClientKey: string | null,
    taskClientKey: string | null,
): IOnboardingTaskDraft | null => {
    if (!draftPlan || !moduleClientKey || !taskClientKey) {
        return null;
    }

    const parentModule = draftPlan.modules.find(
        (module) => module.clientKey === moduleClientKey,
    );

    return parentModule?.tasks.find((task) => task.clientKey === taskClientKey) ?? null;
};

const isBlankNewDraft = (draftPlan: IOnboardingPlanDraft | null | undefined): boolean =>
    !!draftPlan &&
    !draftPlan.id &&
    !draftPlan.name.trim() &&
    !draftPlan.description.trim() &&
    !draftPlan.targetAudience.trim() &&
    draftPlan.durationDays === 30 &&
    draftPlan.modules.length === 0;

interface IPlanEditorProps {
    planId: string;
}

interface ITaskModalState {
    moduleClientKey: string;
    taskClientKey?: string | null;
}

/**
 * Renders the facilitator onboarding-plan editor and lifecycle actions.
 */
const PlanEditor: React.FC<IPlanEditorProps> = ({ planId }) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        addModule,
        addTask,
        archivePlan,
        clonePlan,
        createPlan,
        getPlanDetail,
        initialiseDraft,
        moveModule,
        moveTask,
        publishPlan,
        removeModule,
        removeTask,
        resetDraft,
        setDraftMetadata,
        updateModule,
        updatePlan,
        updateTask,
    } = useOnboardingPlanActions();
    const { draftPlan, isDetailPending, isMutationPending } =
        useOnboardingPlanState();
    const [taskModalState, setTaskModalState] = useState<ITaskModalState | null>(
        null,
    );
    const isNewPlan = planId === "new";
    const isDraftEditable = draftPlan?.status === OnboardingPlanStatus.Draft;
    const showCreationChoice = isNewPlan && isBlankNewDraft(draftPlan);

    const loadEditor = useEffectEvent(async (): Promise<void> => {
        if (isNewPlan) {
            initialiseDraft();
            return;
        }

        const detail = await getPlanDetail(planId);

        if (!detail) {
            messageApi.error("The requested onboarding plan could not be loaded.");
        }
    });

    const resetEditorDraft = useEffectEvent((): void => {
        resetDraft();
    });

    useEffect(() => {
        void loadEditor();

        return () => {
            resetEditorDraft();
        };
    }, [planId]);

    const editingTask = useMemo(
        () =>
            findDraftTask(
                draftPlan,
                taskModalState?.moduleClientKey ?? null,
                taskModalState?.taskClientKey ?? null,
            ),
        [draftPlan, taskModalState],
    );

    const handleSave = async (): Promise<void> => {
        if (!draftPlan) {
            return;
        }

        const validationError = validateDraftForSave(draftPlan);

        if (validationError) {
            messageApi.error(validationError);
            return;
        }

        const savedPlan = draftPlan.id
            ? await updatePlan(buildUpdateRequest(draftPlan))
            : await createPlan(buildCreateRequest(draftPlan));

        if (!savedPlan) {
            messageApi.error("The onboarding plan could not be saved.");
            return;
        }

        messageApi.success("Onboarding plan saved.");

        if (!draftPlan.id) {
            startTransition(() => {
                router.replace(buildFacilitatorPlanRoute(savedPlan.id));
            });
        }
    };

    const handlePublish = async (): Promise<void> => {
        if (!draftPlan?.id) {
            messageApi.error("Save the draft before publishing it.");
            return;
        }

        const validationError = validateDraftForPublish(draftPlan);

        if (validationError) {
            messageApi.error(validationError);
            return;
        }

        const publishedPlan = await publishPlan(draftPlan.id);

        if (!publishedPlan) {
            messageApi.error("The onboarding plan could not be published.");
            return;
        }

        messageApi.success("Onboarding plan published.");
    };

    const handleArchive = async (): Promise<void> => {
        if (!draftPlan?.id) {
            messageApi.error("Only saved plans can be archived.");
            return;
        }

        const archivedPlan = await archivePlan(draftPlan.id);

        if (!archivedPlan) {
            messageApi.error("The onboarding plan could not be archived.");
            return;
        }

        messageApi.success("Onboarding plan archived.");
    };

    const handleClone = async (): Promise<void> => {
        if (!draftPlan?.id) {
            messageApi.error("Save the current draft before cloning it.");
            return;
        }

        const clonedPlan = await clonePlan({ sourcePlanId: draftPlan.id });

        if (!clonedPlan) {
            messageApi.error("The onboarding plan could not be cloned.");
            return;
        }

        messageApi.success("Draft copy created.");
        startTransition(() => {
            router.push(buildFacilitatorPlanRoute(clonedPlan.id));
        });
    };

    const handleTaskSubmit = async (
        values: IOnboardingTaskEditorValues,
    ): Promise<void> => {
        if (!taskModalState) {
            return;
        }

        if (taskModalState.taskClientKey) {
            updateTask(
                taskModalState.moduleClientKey,
                taskModalState.taskClientKey,
                values,
            );
        } else {
            addTask(taskModalState.moduleClientKey, values);
        }

        setTaskModalState(null);
    };

    if (isDetailPending || (!draftPlan && !isNewPlan)) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!draftPlan) {
        return (
            <Empty
                className={styles.emptyState}
                description="The plan builder could not initialise a working draft."
            />
        );
    }

    return (
        <Space direction="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        {isNewPlan ? "New Onboarding Plan" : draftPlan.name || "Plan Editor"}
                    </Title>
                    <Paragraph type="secondary">
                        Keep the template structure ordered and lifecycle-safe for
                        facilitators.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<RollbackOutlined />}
                        onClick={() =>
                            startTransition(() =>
                                router.push(APP_ROUTES.facilitatorPlans),
                            )
                        }
                    >
                        Back to Plans
                    </Button>
                    <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        onClick={() => void handleSave()}
                        loading={isMutationPending}
                        disabled={!isDraftEditable}
                    >
                        Save Draft
                    </Button>
                    <Button
                        icon={<SendOutlined />}
                        onClick={() => void handlePublish()}
                        loading={isMutationPending}
                        disabled={!draftPlan.id || !isDraftEditable}
                    >
                        Publish
                    </Button>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => void handleClone()}
                        loading={isMutationPending}
                        disabled={!draftPlan.id}
                    >
                        Clone
                    </Button>
                    <Button
                        icon={<StopOutlined />}
                        danger
                        onClick={() => void handleArchive()}
                        loading={isMutationPending}
                        disabled={
                            !draftPlan.id ||
                            draftPlan.status === OnboardingPlanStatus.Archived
                        }
                    >
                        Archive
                    </Button>
                </Space>
            </div>

            {!isDraftEditable ? (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    message={`This plan is ${ONBOARDING_PLAN_STATUS_LABELS[draftPlan.status].toLowerCase()} and its structure is read-only.`}
                />
            ) : null}

            {showCreationChoice ? (
                <Card className={styles.editorCard}>
                    <div className={styles.creationGrid}>
                        <Card className={styles.creationCard}>
                            <div className={styles.creationCardBody}>
                                <div>
                                    <Title level={4}>Build Manually</Title>
                                    <Paragraph type="secondary">
                                        Stay on this page to enter the plan details,
                                        add modules, and define tasks yourself.
                                    </Paragraph>
                                </div>

                                <Paragraph
                                    className={styles.creationAction}
                                    type="secondary"
                                >
                                    The editor below is already ready for manual
                                    authoring.
                                </Paragraph>
                            </div>
                        </Card>

                        <Card className={styles.creationCard}>
                            <div className={styles.creationCardBody}>
                                <div>
                                    <Title level={4}>Create From Document</Title>
                                    <Paragraph type="secondary">
                                        Upload markdown, text, PDF, or image content
                                        and let the backend normalize it into the same
                                        reviewable draft-plan DTO before save.
                                    </Paragraph>
                                </div>

                                <Button
                                    className={styles.creationAction}
                                    icon={<ImportOutlined />}
                                    onClick={() =>
                                        startTransition(() =>
                                            router.push(
                                                APP_ROUTES.facilitatorPlanImport,
                                            ),
                                        )
                                    }
                                >
                                    Open Document Import
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Card>
            ) : null}

            <Card className={styles.editorCard}>
                <Space direction="vertical" size={16} className={styles.pageRoot}>
                    <div className={styles.metadataGrid}>
                        <Input
                            value={draftPlan.name}
                            onChange={(event) =>
                                setDraftMetadata({ name: event.target.value })
                            }
                            placeholder="Plan name"
                            disabled={!isDraftEditable}
                            maxLength={200}
                        />
                        <Input
                            value={draftPlan.targetAudience}
                            onChange={(event) =>
                                setDraftMetadata({
                                    targetAudience: event.target.value,
                                })
                            }
                            placeholder="Target audience"
                            disabled={!isDraftEditable}
                            maxLength={200}
                        />
                        <InputNumber
                            min={1}
                            precision={0}
                            value={draftPlan.durationDays}
                            onChange={(value) =>
                                setDraftMetadata({ durationDays: value ?? 1 })
                            }
                            disabled={!isDraftEditable}
                        />
                        <Input value={ONBOARDING_PLAN_STATUS_LABELS[draftPlan.status]} disabled />
                        <Input.TextArea
                            className={styles.fullWidthField}
                            value={draftPlan.description}
                            onChange={(event) =>
                                setDraftMetadata({
                                    description: event.target.value,
                                })
                            }
                            placeholder="Describe the purpose and scope of this plan."
                            disabled={!isDraftEditable}
                            rows={5}
                            maxLength={4000}
                        />
                    </div>
                </Space>
            </Card>

            <DocumentUploadPanel
                planId={draftPlan.id}
                planStatus={draftPlan.status}
            />

            <Space direction="vertical" size={16} className={styles.modulesWrap}>
                <div className={styles.pageHeader}>
                    <div>
                        <Title level={3}>Modules</Title>
                        <Paragraph type="secondary">
                            Modules become the ordered plan phases used by the builder.
                        </Paragraph>
                    </div>

                    <Button
                        icon={<PlusOutlined />}
                        type="dashed"
                        onClick={addModule}
                        disabled={!isDraftEditable}
                    >
                        Add Module
                    </Button>
                </div>

                {draftPlan.modules.length === 0 ? (
                    <Empty
                        className={styles.emptyState}
                        description="Start by adding the first onboarding module."
                    />
                ) : (
                    draftPlan.modules.map((module) => (
                        <ModulePanel
                            key={module.clientKey}
                            isReadOnly={!isDraftEditable}
                            module={module}
                            moduleCount={draftPlan.modules.length}
                            onAddTask={() =>
                                setTaskModalState({
                                    moduleClientKey: module.clientKey,
                                })
                            }
                            onDeleteTask={(taskClientKey) =>
                                removeTask(module.clientKey, taskClientKey)
                            }
                            onEditTask={(taskClientKey) =>
                                setTaskModalState({
                                    moduleClientKey: module.clientKey,
                                    taskClientKey,
                                })
                            }
                            onModuleChange={(name, description) =>
                                updateModule(module.clientKey, name, description)
                            }
                            onMoveModule={(direction) =>
                                moveModule(module.clientKey, direction)
                            }
                            onMoveTask={(taskClientKey, direction) =>
                                moveTask(module.clientKey, taskClientKey, direction)
                            }
                            onRemoveModule={() => removeModule(module.clientKey)}
                        />
                    ))
                )}
            </Space>

            <TaskFormModal
                editingTask={editingTask}
                isPending={isMutationPending}
                isVisible={taskModalState !== null}
                onCancel={() => setTaskModalState(null)}
                onSubmit={handleTaskSubmit}
            />
        </Space>
    );
};

export default PlanEditor;

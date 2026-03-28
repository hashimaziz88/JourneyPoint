"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import { Empty, Space, Spin, message } from "antd";
import { buildFacilitatorPlanRoute } from "@/constants/auth/routes";
import DocumentUploadPanel from "@/components/plans/DocumentUploadPanel";
import PlanEditorHeader from "@/components/plans/PlanEditorHeader";
import PlanEditorMetadataCard from "@/components/plans/PlanEditorMetadataCard";
import PlanEditorModulesSection from "@/components/plans/PlanEditorModulesSection";
import TaskFormModal from "@/components/plans/TaskFormModal";
import { useStyles } from "@/components/plans/style/style";
import {
    useOnboardingPlanActions,
    useOnboardingPlanState,
} from "@/providers/onboardingPlanProvider";
import {
    type IOnboardingTaskEditorValues,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import {
    buildCreateOnboardingPlanRequest,
    buildUpdateOnboardingPlanRequest,
    findDraftTask,
    isBlankNewDraft,
    validateDraftForPublish,
    validateDraftForSave,
} from "@/utils/plans/planEditor";
import { useRouter } from "next/navigation";
import type {
    IPlanEditorProps,
    IPlanEditorTaskModalState,
} from "@/types/plans/components";

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
    const { draftPlan, isDetailPending, isMutationPending } = useOnboardingPlanState();
    const [taskModalState, setTaskModalState] = useState<IPlanEditorTaskModalState | null>(null);
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
            ? await updatePlan(buildUpdateOnboardingPlanRequest(draftPlan))
            : await createPlan(buildCreateOnboardingPlanRequest(draftPlan));

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
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <PlanEditorHeader
                isDraftEditable={isDraftEditable}
                isMutationPending={isMutationPending}
                isNewPlan={isNewPlan}
                planId={draftPlan.id}
                planName={draftPlan.name}
                planStatus={draftPlan.status}
                showCreationChoice={showCreationChoice}
                onArchive={handleArchive}
                onClone={handleClone}
                onPublish={handlePublish}
                onSave={handleSave}
            />

            <PlanEditorMetadataCard
                draftPlan={draftPlan}
                isDraftEditable={isDraftEditable}
                onMetadataChange={setDraftMetadata}
            />

            <DocumentUploadPanel planId={draftPlan.id} planStatus={draftPlan.status} />

            <PlanEditorModulesSection
                isDraftEditable={isDraftEditable}
                modules={draftPlan.modules}
                onAddModule={addModule}
                onAddTask={(moduleClientKey) => setTaskModalState({ moduleClientKey })}
                onDeleteTask={removeTask}
                onEditTask={(moduleClientKey, taskClientKey) =>
                    setTaskModalState({ moduleClientKey, taskClientKey })
                }
                onModuleChange={updateModule}
                onMoveModule={moveModule}
                onMoveTask={moveTask}
                onRemoveModule={removeModule}
            />

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

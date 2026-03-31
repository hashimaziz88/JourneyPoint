"use client";

import React, { startTransition, useEffect, useEffectEvent, useState } from "react";
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    Empty,
    Space,
    Spin,
    Statistic,
    Tabs,
    Tag,
    Typography,
    message,
} from "antd";
import {
    CheckCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useStyles } from "@/components/journey/style/style";
import PersonalisationDiff from "@/components/journey/PersonalisationDiff";
import JourneyTaskEditorModal from "@/components/journey/JourneyTaskEditorModal";
import JourneyTaskList from "@/components/journey/JourneyTaskList";
import {
    HIRE_STATUS_LABELS,
    HIRE_STATUS_TAG_COLORS,
} from "@/constants/hire/list";
import {
    JOURNEY_STATUS_LABELS,
    JOURNEY_STATUS_TAG_COLORS,
} from "@/constants/journey/review";
import { useHireActions, useHireState } from "@/providers/hireProvider";
import {
    useJourneyActions,
    useJourneyState,
} from "@/providers/journeyProvider";
import type {
    IAddJourneyTaskRequest,
    IJourneyTaskReviewDto,
} from "@/types/journey";
import type { IJourneyReviewViewProps } from "@/types/journey/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";
import {
    groupJourneyTasksByModule,
    isJourneyDraftEditable,
} from "@/utils/journey/review";
import { getHighlightedTaskIds } from "@/utils/journey/personalisation";
import { buildFacilitatorHireRoute } from "@/constants/auth/routes";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

/**
 * Drives facilitator review, activation, and draft-task editing for one hire journey.
 */
const JourneyReviewView: React.FC<IJourneyReviewViewProps> = ({ hireId }) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        getHireDetail,
        resetSelectedHire,
    } = useHireActions();
    const { selectedHire } = useHireState();
    const {
        activate,
        addTask,
        generateDraft,
        getDraft,
        removePendingTask,
        resetJourney,
        updateTask,
    } = useJourneyActions();
    const {
        isDetailPending,
        isMutationPending,
        journey,
        personalisationProposal,
    } = useJourneyState();
    const [editingTask, setEditingTask] = useState<IJourneyTaskReviewDto | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const loadScreenEffect = useEffectEvent(async (): Promise<void> => {
        await getHireDetail(hireId);
        await getDraft(hireId);
    });

    const clearScreenState = useEffectEvent((): void => {
        resetJourney();
        resetSelectedHire();
    });

    useEffect(() => {
        void loadScreenEffect();

        return () => {
            clearScreenState();
        };
    }, [hireId]);

    const refreshScreen = async (): Promise<void> => {
        await getHireDetail(hireId);
        await getDraft(hireId);
    };

    const handleGenerateDraft = async (): Promise<void> => {
        const draft = await generateDraft({ hireId });

        if (!draft) {
            messageApi.error("The journey draft could not be generated.");
            return;
        }

        messageApi.success("Journey draft generated.");
        await getHireDetail(hireId);
    };

    const handleSubmitTask = async (payload: IAddJourneyTaskRequest): Promise<void> => {
        let result = null;

        if (editingTask) {
            result = await updateTask(hireId, editingTask.id, payload);
        } else if (journey) {
            result = await addTask(hireId, journey.journeyId, payload);
        }

        if (!result) {
            messageApi.error("The journey task change could not be saved.");
            return;
        }

        setIsTaskModalOpen(false);
        setEditingTask(null);
        messageApi.success(editingTask ? "Draft task updated." : "Draft task added.");
        await getHireDetail(hireId);
    };

    const handleRemoveTask = async (task: IJourneyTaskReviewDto): Promise<void> => {
        const result = await removePendingTask(hireId, task.id);

        if (!result) {
            messageApi.error("The draft task could not be removed.");
            return;
        }

        messageApi.success("Draft task removed.");
        await getHireDetail(hireId);
    };

    const handleActivateJourney = async (): Promise<void> => {
        const result = await activate(hireId);

        if (!result) {
            messageApi.error("The journey could not be activated.");
            return;
        }

        messageApi.success("Journey activated.");
        await getHireDetail(hireId);
    };

    if (!selectedHire && isDetailPending) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!selectedHire) {
        return <Empty className={styles.emptyState} description="Hire record not found." />;
    }

    const isEditable = isJourneyDraftEditable(journey);
    const modules = groupJourneyTasksByModule(journey);
    const highlightedTaskIds = getHighlightedTaskIds(personalisationProposal);
    const pendingTasks = journey?.tasks.filter((task) => !task.completedAt).length ?? 0;
    const completedTasks = (journey?.tasks.length ?? 0) - pendingTasks;

    const tasksTab = (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            {isEditable ? (
                <Alert
                    type="info"
                    title="Draft review is open."
                    description="Edits here change only this hire's journey snapshot. The source onboarding plan stays unchanged."
                />
            ) : (
                <Alert
                    type="success"
                    title="Journey review is locked."
                    description="This journey is no longer in draft, so task snapshots are read-only."
                />
            )}

            <JourneyTaskList
                highlightedTaskIds={highlightedTaskIds}
                isEditable={isEditable}
                isMutationPending={isMutationPending}
                modules={modules}
                onEditTask={(task) => {
                    setEditingTask(task);
                    setIsTaskModalOpen(true);
                }}
                onRemoveTask={handleRemoveTask}
            />
        </Space>
    );

    return (
        <Space orientation="vertical" size={20} className={styles.pageRoot}>
            {messageContextHolder}
            <Breadcrumb
                items={[
                    {
                        title: (
                            <Button
                                type="link"
                                className={styles.breadcrumbButton}
                                onClick={() => startTransition(() => router.push(buildFacilitatorHireRoute(hireId)))}
                            >
                                Hire
                            </Button>
                        ),
                    },
                    { title: "Journey Review" },
                ]}
            />

            <div className={styles.reviewWorkspace}>
                <Card className={styles.reviewSidebar}>
                    <div className={styles.reviewSidebarSticky}>
                        <Title level={4} className={styles.pageHeading}>
                            {selectedHire.fullName}
                        </Title>
                        <Paragraph type="secondary" className={styles.inlineParagraph}>
                            Keep this panel in view while reviewing tasks so you always have status and plan context.
                        </Paragraph>

                        <Space wrap>
                            <Tag color={HIRE_STATUS_TAG_COLORS[selectedHire.status]}>
                                {HIRE_STATUS_LABELS[selectedHire.status]}
                            </Tag>
                            {journey ? (
                                <Tag color={JOURNEY_STATUS_TAG_COLORS[journey.status]}>
                                    {JOURNEY_STATUS_LABELS[journey.status]}
                                </Tag>
                            ) : (
                                <Tag>No journey generated</Tag>
                            )}
                        </Space>

                        <div className={styles.sidebarStatGrid}>
                            <Statistic title="Start date" value={formatDisplayDate(selectedHire.startDate)} />
                            <Statistic title="Plan" value={selectedHire.onboardingPlanName} />
                            <Statistic title="Activated" value={formatDisplayDateTime(journey?.activatedAt)} />
                            <Statistic title="Tasks" value={journey?.tasks.length ?? 0} />
                            <Statistic title="Pending" value={pendingTasks} />
                            <Statistic title="Completed" value={completedTasks} />
                        </div>

                        <div className={styles.sidebarActions}>
                            <Button
                                icon={<ReloadOutlined />}
                                loading={isDetailPending || isMutationPending}
                                onClick={() => void refreshScreen()}
                            >
                                Refresh
                            </Button>
                            {journey && isEditable ? (
                                <>
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            setEditingTask(null);
                                            setIsTaskModalOpen(true);
                                        }}
                                    >
                                        Add Draft Task
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        loading={isMutationPending}
                                        onClick={() => void handleActivateJourney()}
                                    >
                                        Activate Journey
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </Card>

                <div className={styles.reviewMain}>
                    <div className={styles.pageHeader}>
                        <div>
                            <Title level={2} className={styles.pageHeading}>
                                Journey Review
                            </Title>
                            <Paragraph type="secondary">
                                Review and personalise this hires journey draft in focused sections without losing context.
                            </Paragraph>
                        </div>
                    </div>

                    {journey ? (
                        <Card className={styles.sectionCard}>
                            <Tabs
                                defaultActiveKey="tasks"
                                items={[
                                    { key: "tasks", label: `Tasks (${journey.tasks.length})`, children: tasksTab },
                                    { key: "personalisation", label: "Personalisation", children: <PersonalisationDiff hireId={hireId} /> },
                                ]}
                            />
                        </Card>
                    ) : (
                        <Card className={styles.sectionCard}>
                            <Empty
                                className={styles.emptyState}
                                description="No journey has been generated for this hire yet."
                            >
                                <Button
                                    type="primary"
                                    loading={isMutationPending}
                                    onClick={() => void handleGenerateDraft()}
                                >
                                    Generate Draft Journey
                                </Button>
                            </Empty>
                        </Card>
                    )}
                </div>
            </div>

            <JourneyTaskEditorModal
                isOpen={isTaskModalOpen}
                isPending={isMutationPending}
                journey={journey}
                onCancel={() => {
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleSubmitTask}
                task={editingTask}
            />
        </Space>
    );
};

export default JourneyReviewView;

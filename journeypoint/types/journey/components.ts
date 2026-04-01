import type {
    AddJourneyTaskRequest,
    EnroleeJourneyDashboardDto,
    EnroleeJourneyModuleGroupDto,
    EnroleeJourneyTaskDetailDto,
    EnroleeJourneyTaskListItemDto,
    JourneyDraftDto,
    JourneyModuleGroup,
    JourneyPersonalisationDecision,
    JourneyTaskPersonalisationDiffDto,
    JourneyTaskReviewDto,
    ManagerAssignedTaskDto,
    ManagerDirectReportTaskGroupDto,
    ManagerTaskWorkspaceDto,
    UpdateJourneyTaskRequest,
} from "@/types/journey/journey";

export type JourneyReviewViewProps = {
    hireId: string;
};

export type JourneyTaskListProps = {
    isEditable: boolean;
    isMutationPending: boolean;
    highlightedTaskIds?: string[];
    modules: JourneyModuleGroup[];
    onEditTask: (task: JourneyTaskReviewDto) => void;
    onRemoveTask: (task: JourneyTaskReviewDto) => Promise<void>;
};

export type JourneyTaskEditorModalProps = {
    isOpen: boolean;
    isPending: boolean;
    onCancel: () => void;
    onSubmit: (payload: UpdateJourneyTaskRequest | AddJourneyTaskRequest) => Promise<void>;
    task?: JourneyTaskReviewDto | null;
    journey?: JourneyDraftDto | null;
};

export type EnroleeJourneyDashboardViewProps = {
    dashboard?: EnroleeJourneyDashboardDto | null;
    isError?: boolean;
    isPending: boolean;
    onRefresh: () => Promise<void>;
};

export type EnroleeJourneyModuleSectionProps = {
    module: EnroleeJourneyModuleGroupDto;
};

export type JourneyTaskDetailViewProps = {
    task?: EnroleeJourneyTaskDetailDto | null;
    isPending: boolean;
    isMutationPending: boolean;
    onRefresh: () => Promise<void>;
    onAcknowledge: (task: EnroleeJourneyTaskDetailDto) => Promise<boolean>;
    onComplete: (task: EnroleeJourneyTaskDetailDto) => Promise<boolean>;
};

export type EnroleeJourneyTaskSummaryCardProps = {
    task: EnroleeJourneyTaskListItemDto;
};

export type JourneyTaskAcknowledgementPanelProps = {
    task: EnroleeJourneyTaskDetailDto;
    isPending: boolean;
    onAcknowledge: () => Promise<boolean>;
};

export type ManagerTaskWorkspaceViewProps = {
    workspace?: ManagerTaskWorkspaceDto | null;
    isError?: boolean;
    isPending: boolean;
    isMutationPending: boolean;
    onRefresh: () => Promise<void>;
    onComplete: (journeyTaskId: string) => Promise<boolean>;
};

export type ManagerDirectReportSectionProps = {
    directReport: ManagerDirectReportTaskGroupDto;
    isMutationPending: boolean;
    onComplete: (task: ManagerAssignedTaskDto) => Promise<void>;
};

export type PersonalisationDiffProps = {
    hireId: string;
};

export type PersonalisationDiffCardProps = {
    diff: JourneyTaskPersonalisationDiffDto;
    decision: JourneyPersonalisationDecision;
    onDecisionChange: (
        journeyTaskId: string,
        decision: JourneyPersonalisationDecision,
    ) => void;
};

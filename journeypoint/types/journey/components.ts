import type {
    IAddJourneyTaskRequest,
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyModuleGroupDto,
    IEnroleeJourneyTaskDetailDto,
    IEnroleeJourneyTaskListItemDto,
    IJourneyDraftDto,
    IJourneyModuleGroup,
    IJourneyTaskReviewDto,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";

export interface IJourneyReviewViewProps {
    hireId: string;
}

export interface IJourneyTaskListProps {
    isEditable: boolean;
    isMutationPending: boolean;
    modules: IJourneyModuleGroup[];
    onEditTask: (task: IJourneyTaskReviewDto) => void;
    onRemoveTask: (task: IJourneyTaskReviewDto) => Promise<void>;
}

export interface IJourneyTaskEditorModalProps {
    isOpen: boolean;
    isPending: boolean;
    onCancel: () => void;
    onSubmit: (payload: IUpdateJourneyTaskRequest | IAddJourneyTaskRequest) => Promise<void>;
    task?: IJourneyTaskReviewDto | null;
    journey?: IJourneyDraftDto | null;
}

export interface IEnroleeJourneyDashboardViewProps {
    dashboard?: IEnroleeJourneyDashboardDto | null;
    isPending: boolean;
    onRefresh: () => Promise<void>;
}

export interface IEnroleeJourneyModuleSectionProps {
    module: IEnroleeJourneyModuleGroupDto;
}

export interface IJourneyTaskDetailViewProps {
    task?: IEnroleeJourneyTaskDetailDto | null;
    isPending: boolean;
    isMutationPending: boolean;
    onRefresh: () => Promise<void>;
    onAcknowledge: (task: IEnroleeJourneyTaskDetailDto) => Promise<boolean>;
    onComplete: (task: IEnroleeJourneyTaskDetailDto) => Promise<boolean>;
}

export interface IEnroleeJourneyTaskSummaryCardProps {
    task: IEnroleeJourneyTaskListItemDto;
}

export interface IJourneyTaskAcknowledgementPanelProps {
    task: IEnroleeJourneyTaskDetailDto;
    isPending: boolean;
    onAcknowledge: () => Promise<boolean>;
}

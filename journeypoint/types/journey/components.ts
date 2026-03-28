import type {
    IAddJourneyTaskRequest,
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

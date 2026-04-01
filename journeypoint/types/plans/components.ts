import type { UploadProps } from "antd";
import type {
    MarkdownImportDraftState,
    MarkdownImportWarningDto,
} from "@/types/markdown-import/markdown-import";
import type {
    DocumentModuleOptionDto,
    ExtractedTaskProposalDto,
    ExtractedTaskProposalEditorValues,
    OnboardingDocumentDetailDto,
} from "@/types/onboarding-document/onboarding-document";
import type {
    GetOnboardingPlansInput,
    OnboardingModuleDraft,
    OnboardingPlanDraft,
    OnboardingPlanListItemDto,
    OnboardingPlanMetadataInput,
    OnboardingPlanStatus,
    OnboardingTaskDraft,
    OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan";

export type PlanOrderDirection = "up" | "down";
export type ProposalModalMode = "accept" | "edit";

export type DocumentReviewWorkspaceProps = {
    documentId: string;
    planId: string;
};

export type ProposalModalState = {
    mode: ProposalModalMode;
    proposalId: string;
};

export type DocumentReviewProposalPanelProps = {
    availableModules: DocumentModuleOptionDto[];
    isPending: boolean;
    onAccept: (proposalId: string) => void;
    onEdit: (proposalId: string) => void;
    onReject: (proposalId: string) => Promise<void>;
    proposals: ExtractedTaskProposalDto[];
};

export type DocumentReviewSummaryCardProps = {
    document: OnboardingDocumentDetailDto;
};

export type DocumentStatusAlertContent = {
    description: string;
    title: string;
    type: "error" | "info" | "success";
};

export type DocumentUploadPanelProps = {
    planId?: string | null;
    planStatus: OnboardingPlanStatus;
};

export type ExtractedProposalEditorModalProps = {
    availableModules: DocumentModuleOptionDto[];
    isPending: boolean;
    isVisible: boolean;
    mode: ProposalModalMode;
    onCancel: () => void;
    onSubmit: (values: ExtractedTaskProposalEditorValues) => Promise<void>;
    proposal?: ExtractedTaskProposalDto | null;
};

export type ExtractedProposalListProps = {
    availableModules: DocumentModuleOptionDto[];
    isPending: boolean;
    onAccept: (proposalId: string) => void;
    onEdit: (proposalId: string) => void;
    onReject: (proposalId: string) => Promise<void>;
    proposals: ExtractedTaskProposalDto[];
};

export type MarkdownImportWorkspaceTaskModalState = {
    moduleClientKey: string;
    taskClientKey: string;
};

export type MarkdownImportPreviewMetadataPayload = {
    description?: string;
    durationDays?: number;
    name?: string;
    targetAudience?: string;
};

export type MarkdownImportPreviewCardProps = {
    previewPlan?: MarkdownImportDraftState | null;
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onMetadataChange: (payload: MarkdownImportPreviewMetadataPayload) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
    onRemoveTask: (moduleClientKey: string, taskClientKey: string) => void;
};

export type MarkdownImportSourceCardProps = {
    onSourceContentChange: (value: string, sourceFileName?: string | null) => void;
    sourceContent: string;
    sourceContentType?: string | null;
    sourceFileName?: string | null;
    uploadProps: UploadProps;
};

export type MarkdownImportWarningsProps = {
    warnings: MarkdownImportWarningDto[];
};

export type MarkdownPreviewTableProps = {
    modules: OnboardingModuleDraft[];
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
    onRemoveTask: (moduleClientKey: string, taskClientKey: string) => void;
};

export type MarkdownPreviewTaskRow = OnboardingTaskDraft & {
    key: string;
    moduleClientKey: string;
};

export type ModulePanelProps = {
    isReadOnly: boolean;
    module: OnboardingModuleDraft;
    moduleCount: number;
    onAddTask: () => void;
    onDeleteTask: (taskClientKey: string) => void;
    onEditTask: (taskClientKey: string) => void;
    onModuleChange: (name: string, description: string) => void;
    onMoveModule: (direction: PlanOrderDirection) => void;
    onMoveTask: (taskClientKey: string, direction: PlanOrderDirection) => void;
    onRemoveModule: () => void;
};

export type PlanCardProps = {
    isActionPending: boolean;
    onArchive: (plan: OnboardingPlanListItemDto) => Promise<void>;
    onClone: (plan: OnboardingPlanListItemDto) => Promise<void>;
    onOpen: (planId: string) => void;
    onPublish: (plan: OnboardingPlanListItemDto) => Promise<void>;
    plan: OnboardingPlanListItemDto;
};

export type PlanEditorProps = {
    planId: string;
};

export type PlanEditorTaskModalState = {
    moduleClientKey: string;
    taskClientKey?: string | null;
};

export type PlanEditorHeaderProps = {
    isDraftEditable: boolean;
    isMutationPending: boolean;
    isNewPlan: boolean;
    onArchive: () => Promise<void>;
    onClone: () => Promise<void>;
    onPublish: () => Promise<void>;
    onSave: () => Promise<void>;
    planId?: string | null;
    planName: string;
    planStatus: OnboardingPlanStatus;
    showCreationChoice: boolean;
};

export type PlanEditorMetadataCardProps = {
    draftPlan: OnboardingPlanDraft;
    isDraftEditable: boolean;
    onMetadataChange: (payload: Partial<OnboardingPlanMetadataInput>) => void;
};

export type PlanEditorModulesSectionProps = {
    isDraftEditable: boolean;
    modules: OnboardingModuleDraft[];
    onAddModule: () => void;
    onAddTask: (moduleClientKey: string) => void;
    onDeleteTask: (moduleClientKey: string, taskClientKey: string) => void;
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onMoveModule: (
        moduleClientKey: string,
        direction: PlanOrderDirection,
    ) => void;
    onMoveTask: (
        moduleClientKey: string,
        taskClientKey: string,
        direction: PlanOrderDirection,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
};

export type PlanListQueryState = {
    current: number;
    keyword: string;
    maxResultCount: number;
    status?: OnboardingPlanStatus;
};

export type TaskFormModalProps = {
    editingTask?: OnboardingTaskDraft | null;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: OnboardingTaskEditorValues) => Promise<void>;
};

export type TaskListEditorProps = {
    isReadOnly: boolean;
    onAddTask: () => void;
    onDeleteTask: (taskClientKey: string) => void;
    onEditTask: (taskClientKey: string) => void;
    onMoveTask: (taskClientKey: string, direction: PlanOrderDirection) => void;
    tasks: OnboardingTaskDraft[];
};

export type PlanListRequestBuilder = (query: PlanListQueryState) => GetOnboardingPlansInput;

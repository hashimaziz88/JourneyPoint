import type { UploadProps } from "antd";
import type {
    IMarkdownImportDraftState,
    IMarkdownImportWarningDto,
} from "@/types/markdown-import";
import type {
    IDocumentModuleOptionDto,
    IExtractedTaskProposalDto,
    IExtractedTaskProposalEditorValues,
    IOnboardingDocumentDetailDto,
} from "@/types/onboarding-document";
import type {
    IGetOnboardingPlansInput,
    IOnboardingModuleDraft,
    IOnboardingPlanDraft,
    IOnboardingPlanListItemDto,
    IOnboardingPlanMetadataInput,
    IOnboardingTaskDraft,
    IOnboardingTaskEditorValues,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";

export type TPlanOrderDirection = "up" | "down";
export type TProposalModalMode = "accept" | "edit";

export interface IDocumentReviewWorkspaceProps {
    documentId: string;
    planId: string;
}

export interface IProposalModalState {
    mode: TProposalModalMode;
    proposalId: string;
}

export interface IDocumentReviewProposalPanelProps {
    availableModules: IDocumentModuleOptionDto[];
    isPending: boolean;
    onAccept: (proposalId: string) => void;
    onEdit: (proposalId: string) => void;
    onReject: (proposalId: string) => Promise<void>;
    proposals: IExtractedTaskProposalDto[];
}

export interface IDocumentReviewSummaryCardProps {
    document: IOnboardingDocumentDetailDto;
}

export interface IDocumentStatusAlertContent {
    description: string;
    title: string;
    type: "error" | "info" | "success";
}

export interface IDocumentUploadPanelProps {
    planId?: string | null;
    planStatus: OnboardingPlanStatus;
}

export interface IExtractedProposalEditorModalProps {
    availableModules: IDocumentModuleOptionDto[];
    isPending: boolean;
    isVisible: boolean;
    mode: TProposalModalMode;
    onCancel: () => void;
    onSubmit: (values: IExtractedTaskProposalEditorValues) => Promise<void>;
    proposal?: IExtractedTaskProposalDto | null;
}

export interface IExtractedProposalListProps {
    availableModules: IDocumentModuleOptionDto[];
    isPending: boolean;
    onAccept: (proposalId: string) => void;
    onEdit: (proposalId: string) => void;
    onReject: (proposalId: string) => Promise<void>;
    proposals: IExtractedTaskProposalDto[];
}

export interface IMarkdownImportWorkspaceTaskModalState {
    moduleClientKey: string;
    taskClientKey: string;
}

export interface IMarkdownImportPreviewMetadataPayload {
    description?: string;
    durationDays?: number;
    name?: string;
    targetAudience?: string;
}

export interface IMarkdownImportPreviewCardProps {
    previewPlan?: IMarkdownImportDraftState | null;
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onMetadataChange: (payload: IMarkdownImportPreviewMetadataPayload) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
    onRemoveTask: (moduleClientKey: string, taskClientKey: string) => void;
}

export interface IMarkdownImportSourceCardProps {
    onSourceContentChange: (value: string, sourceFileName?: string | null) => void;
    sourceContent: string;
    sourceContentType?: string | null;
    sourceFileName?: string | null;
    uploadProps: UploadProps;
}

export interface IMarkdownImportWarningsProps {
    warnings: IMarkdownImportWarningDto[];
}

export interface IMarkdownPreviewTableProps {
    modules: IOnboardingModuleDraft[];
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
    onRemoveTask: (moduleClientKey: string, taskClientKey: string) => void;
}

export interface IMarkdownPreviewTaskRow extends IOnboardingTaskDraft {
    key: string;
    moduleClientKey: string;
}

export interface IModulePanelProps {
    isReadOnly: boolean;
    module: IOnboardingModuleDraft;
    moduleCount: number;
    onAddTask: () => void;
    onDeleteTask: (taskClientKey: string) => void;
    onEditTask: (taskClientKey: string) => void;
    onModuleChange: (name: string, description: string) => void;
    onMoveModule: (direction: TPlanOrderDirection) => void;
    onMoveTask: (taskClientKey: string, direction: TPlanOrderDirection) => void;
    onRemoveModule: () => void;
}

export interface IPlanCardProps {
    isActionPending: boolean;
    onArchive: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    onClone: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    onOpen: (planId: string) => void;
    onPublish: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    plan: IOnboardingPlanListItemDto;
}

export interface IPlanEditorProps {
    planId: string;
}

export interface IPlanEditorTaskModalState {
    moduleClientKey: string;
    taskClientKey?: string | null;
}

export interface IPlanEditorHeaderProps {
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
}

export interface IPlanEditorMetadataCardProps {
    draftPlan: IOnboardingPlanDraft;
    isDraftEditable: boolean;
    onMetadataChange: (payload: Partial<IOnboardingPlanMetadataInput>) => void;
}

export interface IPlanEditorModulesSectionProps {
    isDraftEditable: boolean;
    modules: IOnboardingModuleDraft[];
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
        direction: TPlanOrderDirection,
    ) => void;
    onMoveTask: (
        moduleClientKey: string,
        taskClientKey: string,
        direction: TPlanOrderDirection,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
}

export interface IPlanListQueryState {
    current: number;
    keyword: string;
    maxResultCount: number;
    status?: OnboardingPlanStatus;
}

export interface ITaskFormModalProps {
    editingTask?: IOnboardingTaskDraft | null;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: IOnboardingTaskEditorValues) => Promise<void>;
}

export interface ITaskListEditorProps {
    isReadOnly: boolean;
    onAddTask: () => void;
    onDeleteTask: (taskClientKey: string) => void;
    onEditTask: (taskClientKey: string) => void;
    onMoveTask: (taskClientKey: string, direction: TPlanOrderDirection) => void;
    tasks: IOnboardingTaskDraft[];
}

export interface IPlanListRequestBuilder {
    (query: IPlanListQueryState): IGetOnboardingPlansInput;
}

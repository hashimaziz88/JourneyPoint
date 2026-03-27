import { createContext } from "react";
export type {
    ICloneOnboardingPlanRequest,
    ICreateOnboardingPlanRequest,
    IGetOnboardingPlansInput,
    IOnboardingModuleDraft,
    IOnboardingPlanDetailDto,
    IOnboardingPlanDraft,
    IOnboardingPlanListItemDto,
    IOnboardingPlanMetadataInput,
    IOnboardingTaskDraft,
    IOnboardingTaskEditorValues,
    IUpdateOnboardingPlanRequest,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import type {
    ICloneOnboardingPlanRequest,
    ICreateOnboardingPlanRequest,
    IGetOnboardingPlansInput,
    IOnboardingPlanDetailDto,
    IOnboardingPlanDraft,
    IOnboardingPlanListItemDto,
    IOnboardingPlanMetadataInput,
    IOnboardingTaskEditorValues,
    IUpdateOnboardingPlanRequest,
} from "@/types/onboarding-plan";

export interface IOnboardingPlanStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    plans?: IOnboardingPlanListItemDto[] | null;
    totalCount?: number;
    selectedPlan?: IOnboardingPlanDetailDto | null;
    draftPlan?: IOnboardingPlanDraft | null;
}

export interface IOnboardingPlanActionContext {
    getPlans: (request: IGetOnboardingPlansInput) => Promise<void>;
    getPlanDetail: (id: string) => Promise<IOnboardingPlanDetailDto | null>;
    createPlan: (payload: ICreateOnboardingPlanRequest) => Promise<IOnboardingPlanDetailDto | null>;
    updatePlan: (payload: IUpdateOnboardingPlanRequest) => Promise<IOnboardingPlanDetailDto | null>;
    publishPlan: (id: string) => Promise<IOnboardingPlanDetailDto | null>;
    archivePlan: (id: string) => Promise<IOnboardingPlanDetailDto | null>;
    clonePlan: (payload: ICloneOnboardingPlanRequest) => Promise<IOnboardingPlanDetailDto | null>;
    initialiseDraft: () => void;
    resetDraft: () => void;
    setDraftMetadata: (payload: Partial<IOnboardingPlanMetadataInput>) => void;
    addModule: () => void;
    updateModule: (moduleClientKey: string, name: string, description: string) => void;
    removeModule: (moduleClientKey: string) => void;
    moveModule: (moduleClientKey: string, direction: "up" | "down") => void;
    addTask: (moduleClientKey: string, payload: IOnboardingTaskEditorValues) => void;
    updateTask: (moduleClientKey: string, taskClientKey: string, payload: IOnboardingTaskEditorValues) => void;
    removeTask: (moduleClientKey: string, taskClientKey: string) => void;
    moveTask: (moduleClientKey: string, taskClientKey: string, direction: "up" | "down") => void;
}

export const INITIAL_STATE: IOnboardingPlanStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isListPending: false,
    isDetailPending: false,
    isMutationPending: false,
    plans: [],
    totalCount: 0,
    selectedPlan: null,
    draftPlan: null,
};

export const OnboardingPlanStateContext = createContext<IOnboardingPlanStateContext>(INITIAL_STATE);
export const OnboardingPlanActionContext = createContext<IOnboardingPlanActionContext | undefined>(undefined);

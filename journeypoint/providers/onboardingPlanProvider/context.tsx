import { createContext } from "react";
export type {
    CloneOnboardingPlanRequest,
    CreateOnboardingPlanRequest,
    GetOnboardingPlansInput,
    OnboardingModuleDraft,
    OnboardingPlanDetailDto,
    OnboardingPlanDraft,
    OnboardingPlanListItemDto,
    OnboardingPlanMetadataInput,
    OnboardingTaskDraft,
    OnboardingTaskEditorValues,
    UpdateOnboardingPlanRequest,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan/onboarding-plan";
import type {
    CloneOnboardingPlanRequest,
    CreateOnboardingPlanRequest,
    GetOnboardingPlansInput,
    OnboardingPlanDetailDto,
    OnboardingPlanDraft,
    OnboardingPlanListItemDto,
    OnboardingPlanMetadataInput,
    OnboardingTaskEditorValues,
    UpdateOnboardingPlanRequest,
} from "@/types/onboarding-plan/onboarding-plan";

export interface IOnboardingPlanStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    plans?: OnboardingPlanListItemDto[] | null;
    totalCount?: number;
    selectedPlan?: OnboardingPlanDetailDto | null;
    draftPlan?: OnboardingPlanDraft | null;
}

export interface IOnboardingPlanActionContext {
    getPlans: (request: GetOnboardingPlansInput) => Promise<void>;
    getPlanDetail: (id: string) => Promise<OnboardingPlanDetailDto | null>;
    createPlan: (payload: CreateOnboardingPlanRequest) => Promise<OnboardingPlanDetailDto | null>;
    updatePlan: (payload: UpdateOnboardingPlanRequest) => Promise<OnboardingPlanDetailDto | null>;
    publishPlan: (id: string) => Promise<OnboardingPlanDetailDto | null>;
    archivePlan: (id: string) => Promise<OnboardingPlanDetailDto | null>;
    clonePlan: (payload: CloneOnboardingPlanRequest) => Promise<OnboardingPlanDetailDto | null>;
    initialiseDraft: () => void;
    resetDraft: () => void;
    setDraftMetadata: (payload: Partial<OnboardingPlanMetadataInput>) => void;
    addModule: () => void;
    updateModule: (moduleClientKey: string, name: string, description: string) => void;
    removeModule: (moduleClientKey: string) => void;
    moveModule: (moduleClientKey: string, direction: "up" | "down") => void;
    addTask: (moduleClientKey: string, payload: OnboardingTaskEditorValues) => void;
    updateTask: (moduleClientKey: string, taskClientKey: string, payload: OnboardingTaskEditorValues) => void;
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

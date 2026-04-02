import { createContext } from "react";
export type {
    CreateHireRequest,
    HireDetailDto,
    HireEnrolmentResultDto,
    HireListItemDto,
    HireManagerOption,
    HirePlanOption,
    GetHiresInput,
} from "@/types/hire/hire";
import type {
    CreateHireRequest,
    HireDetailDto,
    HireEnrolmentResultDto,
    HireListItemDto,
    HireManagerOption,
    HirePlanOption,
    GetHiresInput,
} from "@/types/hire/hire";

export interface IHireStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    isReferencePending: boolean;
    hires?: HireListItemDto[] | null;
    totalCount?: number;
    selectedHire?: HireDetailDto | null;
    planOptions?: HirePlanOption[] | null;
    managerOptions?: HireManagerOption[] | null;
}

export interface IHireActionContext {
    getHires: (request: GetHiresInput) => Promise<void>;
    getHireDetail: (id: string) => Promise<HireDetailDto | null>;
    createHire: (payload: CreateHireRequest) => Promise<HireEnrolmentResultDto | null>;
    resendWelcomeNotification: (hireId: string) => Promise<HireEnrolmentResultDto | null>;
    getPublishedPlanOptions: () => Promise<void>;
    getManagerOptions: () => Promise<void>;
    resetSelectedHire: () => void;
}

export const INITIAL_STATE: IHireStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isListPending: false,
    isDetailPending: false,
    isMutationPending: false,
    isReferencePending: false,
    hires: [],
    totalCount: 0,
    selectedHire: null,
    planOptions: [],
    managerOptions: [],
};

export const HireStateContext = createContext<IHireStateContext>(INITIAL_STATE);
export const HireActionContext = createContext<IHireActionContext | undefined>(undefined);

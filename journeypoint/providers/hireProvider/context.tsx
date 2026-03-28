import { createContext } from "react";
export type {
    ICreateHireRequest,
    IHireDetailDto,
    IHireEnrolmentResultDto,
    IHireListItemDto,
    IHireManagerOption,
    IHirePlanOption,
    IGetHiresInput,
} from "@/types/hire";
import type {
    ICreateHireRequest,
    IHireDetailDto,
    IHireEnrolmentResultDto,
    IHireListItemDto,
    IHireManagerOption,
    IHirePlanOption,
    IGetHiresInput,
} from "@/types/hire";

export interface IHireStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    isReferencePending: boolean;
    hires?: IHireListItemDto[] | null;
    totalCount?: number;
    selectedHire?: IHireDetailDto | null;
    planOptions?: IHirePlanOption[] | null;
    managerOptions?: IHireManagerOption[] | null;
}

export interface IHireActionContext {
    getHires: (request: IGetHiresInput) => Promise<void>;
    getHireDetail: (id: string) => Promise<IHireDetailDto | null>;
    createHire: (payload: ICreateHireRequest) => Promise<IHireEnrolmentResultDto | null>;
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

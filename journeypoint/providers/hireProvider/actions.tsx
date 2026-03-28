import { createAction } from "redux-actions";
import type {
    IHireDetailDto,
    IHireEnrolmentResultDto,
    IHireListItemDto,
    IHireManagerOption,
    IHirePlanOption,
    IHireStateContext,
} from "./context";

type HireStatePayload = Partial<IHireStateContext>;

export enum HireActionEnums {
    getHiresPending = "GET_HIRES_PENDING",
    getHiresSuccess = "GET_HIRES_SUCCESS",
    getHiresError = "GET_HIRES_ERROR",

    getHireDetailPending = "GET_HIRE_DETAIL_PENDING",
    getHireDetailSuccess = "GET_HIRE_DETAIL_SUCCESS",
    getHireDetailError = "GET_HIRE_DETAIL_ERROR",

    mutationPending = "HIRE_MUTATION_PENDING",
    mutationSuccess = "HIRE_MUTATION_SUCCESS",
    mutationError = "HIRE_MUTATION_ERROR",

    referencePending = "HIRE_REFERENCE_PENDING",
    referenceSuccess = "HIRE_REFERENCE_SUCCESS",
    referenceError = "HIRE_REFERENCE_ERROR",

    resetSelectedHire = "RESET_SELECTED_HIRE",
}

export const getHiresPending = createAction<HireStatePayload>(
    HireActionEnums.getHiresPending,
    () => ({
        isPending: true,
        isListPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getHiresSuccess = createAction<
    HireStatePayload,
    { hires: IHireListItemDto[]; totalCount: number }
>(HireActionEnums.getHiresSuccess, ({ hires, totalCount }) => ({
    isPending: false,
    isListPending: false,
    isError: false,
    isSuccess: true,
    hires,
    totalCount,
}));

export const getHiresError = createAction<HireStatePayload>(
    HireActionEnums.getHiresError,
    () => ({
        isPending: false,
        isListPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const getHireDetailPending = createAction<HireStatePayload>(
    HireActionEnums.getHireDetailPending,
    () => ({
        isPending: true,
        isDetailPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getHireDetailSuccess = createAction<HireStatePayload, IHireDetailDto>(
    HireActionEnums.getHireDetailSuccess,
    (selectedHire) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        selectedHire,
    }),
);

export const getHireDetailError = createAction<HireStatePayload>(
    HireActionEnums.getHireDetailError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const mutationPending = createAction<HireStatePayload>(
    HireActionEnums.mutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const mutationSuccess = createAction<
    HireStatePayload,
    { selectedHire?: IHireDetailDto | null; lastCreatedHire?: IHireEnrolmentResultDto | null }
>(HireActionEnums.mutationSuccess, ({ selectedHire }) => ({
    isPending: false,
    isMutationPending: false,
    isError: false,
    isSuccess: true,
    ...(selectedHire ? { selectedHire } : {}),
}));

export const mutationError = createAction<HireStatePayload>(
    HireActionEnums.mutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const referencePending = createAction<HireStatePayload>(
    HireActionEnums.referencePending,
    () => ({
        isPending: true,
        isReferencePending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const referenceSuccess = createAction<
    HireStatePayload,
    { planOptions?: IHirePlanOption[]; managerOptions?: IHireManagerOption[] }
>(HireActionEnums.referenceSuccess, (payload) => ({
    isPending: false,
    isReferencePending: false,
    isError: false,
    isSuccess: true,
    ...payload,
}));

export const referenceError = createAction<HireStatePayload>(
    HireActionEnums.referenceError,
    () => ({
        isPending: false,
        isReferencePending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const resetSelectedHire = createAction<HireStatePayload>(
    HireActionEnums.resetSelectedHire,
    () => ({
        isPending: false,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
        selectedHire: null,
    }),
);

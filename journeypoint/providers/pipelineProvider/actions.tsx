import { createAction } from "redux-actions";
import type {
    IPipelineBoardDto,
    IPipelineBoardQueryState,
    IPipelineStateContext,
} from "./context";

type PipelineStatePayload = Partial<IPipelineStateContext>;

export enum PipelineActionEnums {
    getBoardPending = "GET_PIPELINE_BOARD_PENDING",
    getBoardSuccess = "GET_PIPELINE_BOARD_SUCCESS",
    getBoardError = "GET_PIPELINE_BOARD_ERROR",
    setFilters = "SET_PIPELINE_FILTERS",
    resetFilters = "RESET_PIPELINE_FILTERS",
}

export const getBoardPending = createAction<PipelineStatePayload>(
    PipelineActionEnums.getBoardPending,
    () => ({
        isPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getBoardSuccess = createAction<PipelineStatePayload, IPipelineBoardDto>(
    PipelineActionEnums.getBoardSuccess,
    (board) => ({
        isPending: false,
        isError: false,
        isSuccess: true,
        board,
    }),
);

export const getBoardError = createAction<PipelineStatePayload>(
    PipelineActionEnums.getBoardError,
    () => ({
        isPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const setFilters = createAction<PipelineStatePayload, IPipelineBoardQueryState>(
    PipelineActionEnums.setFilters,
    (filters) => ({
        filters,
    }),
);

export const resetFilters = createAction<PipelineStatePayload>(
    PipelineActionEnums.resetFilters,
    () => ({
        filters: {
            keyword: "",
            classification: undefined,
        },
    }),
);

import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IPipelineStateContext } from "./context";
import { PipelineActionEnums } from "./actions";

export const PipelineReducer = handleActions<
    IPipelineStateContext,
    Partial<IPipelineStateContext>
>(
    {
        [PipelineActionEnums.getBoardPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [PipelineActionEnums.getBoardSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [PipelineActionEnums.getBoardError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [PipelineActionEnums.setFilters]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [PipelineActionEnums.resetFilters]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
    INITIAL_STATE,
);

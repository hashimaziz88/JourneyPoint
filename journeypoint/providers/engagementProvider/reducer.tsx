import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IEngagementStateContext } from "./context";
import { EngagementActionEnums } from "./actions";

export const EngagementReducer = handleActions<
    IEngagementStateContext,
    Partial<IEngagementStateContext>
>(
    {
        [EngagementActionEnums.getHireIntelligencePending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.getHireIntelligenceSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.getHireIntelligenceError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.mutationPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.mutationSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.mutationError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [EngagementActionEnums.resetHireIntelligence]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
    INITIAL_STATE,
);

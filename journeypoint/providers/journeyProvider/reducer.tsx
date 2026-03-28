import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IJourneyStateContext } from "./context";
import { JourneyActionEnums } from "./actions";

export const JourneyReducer = handleActions<IJourneyStateContext, Partial<IJourneyStateContext>>(
    {
        [JourneyActionEnums.getJourneyPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getJourneySuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getJourneyError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.mutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.mutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.mutationError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.resetJourney]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IJourneyStateContext } from "./context";
import { JourneyActionEnums } from "./actions";

export const JourneyReducer = handleActions<IJourneyStateContext, Partial<IJourneyStateContext>>(
    {
        [JourneyActionEnums.getJourneyPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getJourneySuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getJourneyError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.getMyJourneyPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getMyJourneySuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getMyJourneyError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.getManagerTasksPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getManagerTasksSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getManagerTasksError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.getMyTaskPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getMyTaskSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.getMyTaskError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.mutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.mutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.mutationError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.participantMutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.participantMutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.participantMutationError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.managerMutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.managerMutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.managerMutationError]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.personalisationPending]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.personalisationRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.personalisationError]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.setPersonalisationDecisions]: (state, action) => ({ ...state, ...action.payload }),
        [JourneyActionEnums.clearPersonalisationReview]: (state, action) => ({ ...state, ...action.payload }),

        [JourneyActionEnums.resetJourney]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IWellnessStateContext } from "./context";
import { WellnessActionEnums } from "./actions";

export const WellnessReducer = handleActions<IWellnessStateContext, Partial<IWellnessStateContext>>(
    {
        [WellnessActionEnums.getOverviewPending]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.getOverviewSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.getOverviewError]: (state, action) => ({ ...state, ...action.payload }),

        [WellnessActionEnums.getDetailPending]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.getDetailSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.getDetailError]: (state, action) => ({ ...state, ...action.payload }),

        [WellnessActionEnums.mutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.mutationSuccessQuestion]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.mutationSuccessCheckIn]: (state, action) => ({ ...state, ...action.payload }),
        [WellnessActionEnums.mutationError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

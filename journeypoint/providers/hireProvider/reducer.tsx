import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IHireStateContext } from "./context";
import { HireActionEnums } from "./actions";

export const HireReducer = handleActions<IHireStateContext, Partial<IHireStateContext>>(
    {
        [HireActionEnums.getHiresPending]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.getHiresSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.getHiresError]: (state, action) => ({ ...state, ...action.payload }),

        [HireActionEnums.getHireDetailPending]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.getHireDetailSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.getHireDetailError]: (state, action) => ({ ...state, ...action.payload }),

        [HireActionEnums.mutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.mutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.mutationError]: (state, action) => ({ ...state, ...action.payload }),

        [HireActionEnums.referencePending]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.referenceSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [HireActionEnums.referenceError]: (state, action) => ({ ...state, ...action.payload }),

        [HireActionEnums.resetSelectedHire]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

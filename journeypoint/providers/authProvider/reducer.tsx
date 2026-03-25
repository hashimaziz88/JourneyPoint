import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext } from "./context";
import { AuthActionEnums } from "./actions";

export const AuthReducer = handleActions<IAuthStateContext, Partial<IAuthStateContext>>(
    {
        [AuthActionEnums.loginPending]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.loginSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.loginError]: (state, action) => ({ ...state, ...action.payload }),

        [AuthActionEnums.registerPending]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.registerSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.registerError]: (state, action) => ({ ...state, ...action.payload }),

        [AuthActionEnums.logoutPending]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.logoutError]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.logoutSuccess]: (state, action) => ({ ...state, ...action.payload }),

        [AuthActionEnums.getMePending]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.getMeSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [AuthActionEnums.getMeError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);
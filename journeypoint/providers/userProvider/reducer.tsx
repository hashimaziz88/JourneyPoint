import { handleActions } from "redux-actions";
import { INITIAL_STATE, IUserStateContext } from "./context";
import { UserActionEnums } from "./actions";

export const UserReducer = handleActions<IUserStateContext, Partial<IUserStateContext>>(
    {
        [UserActionEnums.getAllUsersPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getAllUsersSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getAllUsersError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.getUserPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getUserError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.createUserPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.createUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.createUserError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.updateUserPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.updateUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.updateUserError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.deleteUserPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.deleteUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.deleteUserError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.getRolesPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getRolesSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.getRolesError]: (state, action) => ({ ...state, ...action.payload }),

        [UserActionEnums.resetPasswordPending]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.resetPasswordSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [UserActionEnums.resetPasswordError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

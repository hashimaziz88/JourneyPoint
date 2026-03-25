import { handleActions } from "redux-actions";
import { INITIAL_STATE, IRoleStateContext } from "./context";
import { RoleActionEnums } from "./actions";

export const RoleReducer = handleActions<IRoleStateContext, Partial<IRoleStateContext>>(
    {
        [RoleActionEnums.getAllRolesPending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getAllRolesSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getAllRolesError]: (state, action) => ({ ...state, ...action.payload }),

        [RoleActionEnums.getRoleForEditPending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getRoleForEditSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getRoleForEditError]: (state, action) => ({ ...state, ...action.payload }),

        [RoleActionEnums.createRolePending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.createRoleSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.createRoleError]: (state, action) => ({ ...state, ...action.payload }),

        [RoleActionEnums.updateRolePending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.updateRoleSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.updateRoleError]: (state, action) => ({ ...state, ...action.payload }),

        [RoleActionEnums.deleteRolePending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.deleteRoleSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.deleteRoleError]: (state, action) => ({ ...state, ...action.payload }),

        [RoleActionEnums.getAllPermissionsPending]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getAllPermissionsSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [RoleActionEnums.getAllPermissionsError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITenantStateContext } from "./context";
import { TenantActionEnums } from "./actions";

export const TenantReducer = handleActions<ITenantStateContext, Partial<ITenantStateContext>>(
    {
        [TenantActionEnums.getAllTenantsPending]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.getAllTenantsSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.getAllTenantsError]: (state, action) => ({ ...state, ...action.payload }),

        [TenantActionEnums.createTenantPending]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.createTenantSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.createTenantError]: (state, action) => ({ ...state, ...action.payload }),

        [TenantActionEnums.updateTenantPending]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.updateTenantSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.updateTenantError]: (state, action) => ({ ...state, ...action.payload }),

        [TenantActionEnums.deleteTenantPending]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.deleteTenantSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [TenantActionEnums.deleteTenantError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);

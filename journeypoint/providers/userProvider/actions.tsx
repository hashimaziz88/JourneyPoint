import { createAction } from "redux-actions";
import { IUserStateContext, IUserDto, IRoleListItem } from "./context";

export enum UserActionEnums {
    getAllUsersPending = "GET_ALL_USERS_PENDING",
    getAllUsersSuccess = "GET_ALL_USERS_SUCCESS",
    getAllUsersError = "GET_ALL_USERS_ERROR",

    getUserPending = "GET_USER_PENDING",
    getUserSuccess = "GET_USER_SUCCESS",
    getUserError = "GET_USER_ERROR",

    createUserPending = "CREATE_USER_PENDING",
    createUserSuccess = "CREATE_USER_SUCCESS",
    createUserError = "CREATE_USER_ERROR",

    updateUserPending = "UPDATE_USER_PENDING",
    updateUserSuccess = "UPDATE_USER_SUCCESS",
    updateUserError = "UPDATE_USER_ERROR",

    deleteUserPending = "DELETE_USER_PENDING",
    deleteUserSuccess = "DELETE_USER_SUCCESS",
    deleteUserError = "DELETE_USER_ERROR",

    getRolesPending = "GET_ROLES_FOR_USER_PENDING",
    getRolesSuccess = "GET_ROLES_FOR_USER_SUCCESS",
    getRolesError = "GET_ROLES_FOR_USER_ERROR",

    resetPasswordPending = "RESET_PASSWORD_PENDING",
    resetPasswordSuccess = "RESET_PASSWORD_SUCCESS",
    resetPasswordError = "RESET_PASSWORD_ERROR",

    resetState = "RESET_USER_STATE",
}

export const getAllUsersPending = createAction<IUserStateContext>(
    UserActionEnums.getAllUsersPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getAllUsersSuccess = createAction<IUserStateContext, { items: IUserDto[]; totalCount: number }>(
    UserActionEnums.getAllUsersSuccess,
    ({ items, totalCount }) => ({ isPending: false, isError: false, isSuccess: true, users: items, totalCount })
);

export const getAllUsersError = createAction<IUserStateContext>(
    UserActionEnums.getAllUsersError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const getUserPending = createAction<IUserStateContext>(
    UserActionEnums.getUserPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getUserSuccess = createAction<IUserStateContext, IUserDto>(
    UserActionEnums.getUserSuccess,
    (currentUser: IUserDto) => ({ isPending: false, isError: false, isSuccess: true, currentUser })
);

export const getUserError = createAction<IUserStateContext>(
    UserActionEnums.getUserError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const createUserPending = createAction<IUserStateContext>(
    UserActionEnums.createUserPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const createUserSuccess = createAction<IUserStateContext>(
    UserActionEnums.createUserSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const createUserError = createAction<IUserStateContext>(
    UserActionEnums.createUserError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const updateUserPending = createAction<IUserStateContext>(
    UserActionEnums.updateUserPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const updateUserSuccess = createAction<IUserStateContext>(
    UserActionEnums.updateUserSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const updateUserError = createAction<IUserStateContext>(
    UserActionEnums.updateUserError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const deleteUserPending = createAction<IUserStateContext>(
    UserActionEnums.deleteUserPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const deleteUserSuccess = createAction<IUserStateContext>(
    UserActionEnums.deleteUserSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const deleteUserError = createAction<IUserStateContext>(
    UserActionEnums.deleteUserError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const getRolesPending = createAction<IUserStateContext>(
    UserActionEnums.getRolesPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getRolesSuccess = createAction<IUserStateContext, IRoleListItem[]>(
    UserActionEnums.getRolesSuccess,
    (availableRoles: IRoleListItem[]) => ({ isPending: false, isError: false, isSuccess: false, availableRoles })
);

export const getRolesError = createAction<IUserStateContext>(
    UserActionEnums.getRolesError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const resetPasswordPending = createAction<IUserStateContext>(
    UserActionEnums.resetPasswordPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const resetPasswordSuccess = createAction<IUserStateContext>(
    UserActionEnums.resetPasswordSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const resetPasswordError = createAction<IUserStateContext>(
    UserActionEnums.resetPasswordError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);

export const resetState = createAction<IUserStateContext>(
    UserActionEnums.resetState,
    () => ({
        isPending: false,
        isError: false,
        isSuccess: false,
        users: [],
        currentUser: null,
        totalCount: 0,
        availableRoles: [],
    }),
);

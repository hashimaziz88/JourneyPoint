"use client"
import React, { useReducer, useContext } from "react";
import {
    INITIAL_STATE, UserActionContext, UserStateContext,
    ICreateUserDto, IGetAllUsersRequest, IResetPasswordDto, IUserDto,
} from "./context";
import { UserReducer } from "./reducer";
import {
    getAllUsersPending, getAllUsersSuccess, getAllUsersError,
    getUserPending, getUserSuccess, getUserError,
    createUserPending, createUserSuccess, createUserError,
    updateUserPending, updateUserSuccess, updateUserError,
    deleteUserPending, deleteUserSuccess, deleteUserError,
    getRolesPending, getRolesSuccess, getRolesError,
    resetPasswordPending, resetPasswordSuccess, resetPasswordError,
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);

    const getAll = async (request: IGetAllUsersRequest) => {
        dispatch(getAllUsersPending());
        await getAxiosInstace().get("/api/services/app/User/GetAll", { params: request })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getAllUsersSuccess({ items: data?.items ?? [], totalCount: data?.totalCount ?? 0 }));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getAllUsersError());
            });
    };

    const get = async (id: number) => {
        dispatch(getUserPending());
        await getAxiosInstace().get("/api/services/app/User/Get", { params: { id } })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getUserSuccess(data));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getUserError());
            });
    };

    const createUser = async (payload: ICreateUserDto) => {
        dispatch(createUserPending());
        await getAxiosInstace().post("/api/services/app/User/Create", payload)
            .then(() => {
                dispatch(createUserSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(createUserError());
            });
    };

    const updateUser = async (payload: IUserDto) => {
        dispatch(updateUserPending());
        await getAxiosInstace().put("/api/services/app/User/Update", payload)
            .then(() => {
                dispatch(updateUserSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(updateUserError());
            });
    };

    const deleteUser = async (id: number) => {
        dispatch(deleteUserPending());
        await getAxiosInstace().delete("/api/services/app/User/Delete", { params: { id } })
            .then(() => {
                dispatch(deleteUserSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(deleteUserError());
            });
    };

    const getRoles = async () => {
        dispatch(getRolesPending());
        await getAxiosInstace().get("/api/services/app/User/GetRoles")
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getRolesSuccess(data?.items ?? []));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getRolesError());
            });
    };

    const resetPassword = async (dto: IResetPasswordDto) => {
        dispatch(resetPasswordPending());
        await getAxiosInstace().post("/api/services/app/User/ResetPassword", dto)
            .then(() => {
                dispatch(resetPasswordSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(resetPasswordError());
            });
    };

    return (
        <UserStateContext.Provider value={state}>
            <UserActionContext.Provider value={{ getAll, get, createUser, updateUser, deleteUser, getRoles, resetPassword }}>
                {children}
            </UserActionContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserState = () => {
    const context = useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
};

export const useUserActions = () => {
    const context = useContext(UserActionContext);
    if (context === undefined) {
        throw new Error("useUserActions must be used within a UserProvider");
    }
    return context;
};

"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  createUserError,
  createUserPending,
  createUserSuccess,
  deleteUserError,
  deleteUserPending,
  deleteUserSuccess,
  getRolesError,
  getRolesPending,
  getRolesSuccess,
  getAllUsersError,
  getAllUsersPending,
  getAllUsersSuccess,
  getUserError,
  getUserPending,
  getUserSuccess,
  resetPasswordError,
  resetPasswordPending,
  resetPasswordSuccess,
  updateUserError,
  updateUserPending,
  updateUserSuccess,
} from "./actions";
import {
  INITIAL_STATE,
  UserActionContext,
  UserStateContext,
  type ICreateUserDto,
  type IGetAllUsersRequest,
  type IResetPasswordDto,
  type IUserDto,
} from "./context";
import { UserReducer } from "./reducer";

/**
 * Provides user-management state and actions for admin workspaces.
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);

  const getAll = async (request: IGetAllUsersRequest): Promise<void> => {
    dispatch(getAllUsersPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/User/GetAll",
        { params: request },
      );
      const data = response.data?.result ?? response.data;

      dispatch(
        getAllUsersSuccess({
          items: data?.items ?? [],
          totalCount: data?.totalCount ?? 0,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(getAllUsersError());
    }
  };

  const get = async (id: number): Promise<void> => {
    dispatch(getUserPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/User/Get",
        { params: { id } },
      );
      const data = response.data?.result ?? response.data;

      dispatch(getUserSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getUserError());
    }
  };

  const createUser = async (payload: ICreateUserDto): Promise<void> => {
    dispatch(createUserPending());

    try {
      await getAxiosInstance().post("/api/services/app/User/Create", payload);
      dispatch(createUserSuccess());
    } catch (error) {
      console.error(error);
      dispatch(createUserError());
    }
  };

  const updateUser = async (payload: IUserDto): Promise<void> => {
    dispatch(updateUserPending());

    try {
      await getAxiosInstance().put("/api/services/app/User/Update", payload);
      dispatch(updateUserSuccess());
    } catch (error) {
      console.error(error);
      dispatch(updateUserError());
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    dispatch(deleteUserPending());

    try {
      await getAxiosInstance().delete("/api/services/app/User/Delete", {
        params: { id },
      });
      dispatch(deleteUserSuccess());
    } catch (error) {
      console.error(error);
      dispatch(deleteUserError());
    }
  };

  const getRoles = async (): Promise<void> => {
    dispatch(getRolesPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/User/GetRoles",
      );
      const data = response.data?.result ?? response.data;

      dispatch(getRolesSuccess(data?.items ?? []));
    } catch (error) {
      console.error(error);
      dispatch(getRolesError());
    }
  };

  const resetPassword = async (dto: IResetPasswordDto): Promise<void> => {
    dispatch(resetPasswordPending());

    try {
      await getAxiosInstance().post(
        "/api/services/app/User/ResetPassword",
        dto,
      );
      dispatch(resetPasswordSuccess());
    } catch (error) {
      console.error(error);
      dispatch(resetPasswordError());
    }
  };

  return (
    <UserStateContext.Provider value={state}>
      <UserActionContext.Provider
        value={{
          getAll,
          get,
          createUser,
          updateUser,
          deleteUser,
          getRoles,
          resetPassword,
        }}
      >
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

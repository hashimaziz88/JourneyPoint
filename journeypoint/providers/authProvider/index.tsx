"use client"
import React, { useReducer, useContext } from "react";
import { INITIAL_STATE, AuthActionContext, AuthStateContext, IUserLoginRequest, IUserRegisterRequest } from "./context";
import { AuthReducer } from "./reducer";
import {
    loginPending, loginSuccess, loginError,
    registerPending, registerSuccess, registerError,
    logoutPending, logoutSuccess, logoutError,
    getMePending, getMeSuccess, getMeError
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const router = useRouter();

    const login = async (payload: IUserLoginRequest) => {
        dispatch(loginPending());
        await getAxiosInstace().post("/api/Auth/login", payload)
            .then((response) => {
                dispatch(loginSuccess(response.data));
                sessionStorage.setItem('token', response.data.token);
                router.push("/dashboard");
            })
            .catch((error) => {
                dispatch(loginError());
                console.error(error.message);
            });
    };

    const register = async (payload: IUserRegisterRequest) => {
        dispatch(registerPending());
        await getAxiosInstace().post("/api/Auth/register", payload)
            .then((response) => {
                dispatch(registerSuccess(response.data));
                sessionStorage.setItem('token', response.data.token);
                router.push("/dashboard");
            })
            .catch((error) => {
                console.error(error);
                dispatch(registerError());
            });
    };

    const logout = async () => {
        dispatch(logoutPending());
        await Promise.resolve()
            .then(() => {
                sessionStorage.removeItem("token");
                dispatch(logoutSuccess());
            })
            .catch((error) => {
                console.error("Logout error:", error);
                dispatch(logoutError());
            });
    };

    const getMe = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            dispatch(getMePending());
            await getAxiosInstace().get("/api/Auth/me")
                .then((response) => {
                    dispatch(getMeSuccess(response.data));
                })
                .catch((error) => {
                    console.error(error);
                    sessionStorage.removeItem("token");
                    dispatch(getMeError());
                });
        }
    };

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionContext.Provider value={{ login, register, logout, getMe }}>
                {children}
            </AuthActionContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error("useAuthState must be used within an AuthProvider");
    }
    return context;
};

export const useAuthActions = () => {
    const context = useContext(AuthActionContext);
    if (context === undefined) {
        throw new Error("useAuthActions must be used within an AuthProvider");
    }
    return context;
};
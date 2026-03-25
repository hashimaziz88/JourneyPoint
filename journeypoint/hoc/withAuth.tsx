"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { WithAuthOptions } from "@/types/auth/withAuth";

const subscribeToStorage = (callback: () => void) => {
    globalThis.addEventListener("storage", callback);
    return () => globalThis.removeEventListener("storage", callback);
}

const getToken = () => localStorage.getItem("auth_token");
const getRole = () => localStorage.getItem("user_role");
const getServerSnapshot = () => null;

const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    { allowedRoles = [] }: WithAuthOptions = {}
) => {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();
        const token = useSyncExternalStore(subscribeToStorage, getToken, getServerSnapshot);
        const userRole = useSyncExternalStore(subscribeToStorage, getRole, getServerSnapshot);

        useEffect(() => {
            if (!token) {
                router.replace("/login");
                return;
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(userRole ?? "")) {
                router.replace(userRole === "admin" ? "/admin" : "/client");
            }
        }, [token, userRole, router]);

        if (!token) return null;
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole ?? "")) return null;

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;

    return AuthenticatedComponent;
};

export default withAuth;

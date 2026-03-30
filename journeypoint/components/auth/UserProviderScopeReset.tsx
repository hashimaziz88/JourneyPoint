"use client";

import React, { useEffect, useEffectEvent } from "react";
import { useAuthState } from "@/providers/authProvider";
import { useUserActions } from "@/providers/userProvider";

/**
 * Resets cached user-management state whenever the authenticated user scope changes.
 */
const UserProviderScopeReset: React.FC = () => {
    const { isAuthenticated, tenant, user } = useAuthState();
    const { resetState } = useUserActions();
    const userScopeKey = `${isAuthenticated ? "auth" : "anon"}:${tenant?.tenantId ?? "none"}:${user?.userId ?? "none"}`;
    const resetScopeState = useEffectEvent((): void => {
        resetState();
    });

    useEffect(() => {
        resetScopeState();
    }, [userScopeKey]);

    return null;
};

export default UserProviderScopeReset;

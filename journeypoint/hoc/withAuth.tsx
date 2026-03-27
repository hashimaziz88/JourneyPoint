"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WithAuthOptions } from "@/types/auth/withAuth";
import { APP_ROUTES } from "@/constants/auth/routes";
import { useAppSession } from "@/helpers/useAppSession";
import Spinner from "@/components/spinner/Spinner";

const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    { allowHost = false, allowedRoles = [], requiredPermission }: WithAuthOptions = {}
) => {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();
        const {
            defaultRoute,
            hasPermission,
            isAuthenticated,
            isHostScope,
            isReady,
            primaryRoleName,
        } = useAppSession();
        const hasRequiredPermission = hasPermission(requiredPermission);
        const hasRoleRestriction = allowHost || allowedRoles.length > 0;
        const hasAllowedRole =
            !hasRoleRestriction ||
            (allowHost && isHostScope) ||
            allowedRoles.includes(primaryRoleName ?? "");

        useEffect(() => {
            if (!isReady) {
                return;
            }

            if (!isAuthenticated) {
                router.replace(APP_ROUTES.login);
                return;
            }

            if (!hasAllowedRole || (requiredPermission && !hasRequiredPermission)) {
                router.replace(defaultRoute);
            }
        }, [defaultRoute, hasAllowedRole, hasRequiredPermission, isAuthenticated, isReady, router]);

        if (!isReady) {
            return <Spinner />;
        }

        if (!isAuthenticated) {
            return null;
        }

        if (!hasAllowedRole || (requiredPermission && !hasRequiredPermission)) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;

    return AuthenticatedComponent;
};

export default withAuth;

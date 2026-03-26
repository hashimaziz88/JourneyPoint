"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WithAuthOptions } from "@/types/auth/withAuth";
import { APP_ROUTES } from "@/constants/auth/routes";
import { useAppSession } from "@/helpers/useAppSession";
import Spinner from "@/components/spinner/Spinner";

const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    { requiredPermission }: WithAuthOptions = {}
) => {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();
        const {
            defaultRoute,
            hasPermission,
            isAuthenticated,
            isReady,
        } = useAppSession();
        const hasRequiredPermission = hasPermission(requiredPermission);

        useEffect(() => {
            if (!isReady) {
                return;
            }

            if (!isAuthenticated) {
                router.replace(APP_ROUTES.login);
                return;
            }

            if (requiredPermission && !hasRequiredPermission) {
                router.replace(defaultRoute);
            }
        }, [defaultRoute, hasRequiredPermission, isAuthenticated, isReady, router]);

        if (!isReady) {
            return <Spinner />;
        }

        if (!isAuthenticated) {
            return null;
        }

        if (requiredPermission && !hasRequiredPermission) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;

    return AuthenticatedComponent;
};

export default withAuth;

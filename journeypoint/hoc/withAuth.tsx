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
        const session = useAppSession();

        useEffect(() => {
            if (!session.isReady) {
                return;
            }

            if (!session.isAuthenticated) {
                router.replace(APP_ROUTES.login);
                return;
            }

            if (requiredPermission && !session.hasPermission(requiredPermission)) {
                router.replace(session.defaultRoute);
            }
        }, [router, session]);

        if (!session.isReady) {
            return <Spinner />;
        }

        if (!session.isAuthenticated) {
            return null;
        }

        if (requiredPermission && !session.hasPermission(requiredPermission)) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;

    return AuthenticatedComponent;
};

export default withAuth;

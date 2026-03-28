"use client";

import React, { useEffect, useRef } from "react";
import { useAuthActions } from "@/providers/authProvider";
import { ignoreAsyncError } from "@/utils/async";

const AuthSessionBootstrap: React.FC = () => {
    const { refreshSession } = useAuthActions();
    const hasBootstrappedRef = useRef(false);

    useEffect(() => {
        if (hasBootstrappedRef.current) {
            return;
        }

        hasBootstrappedRef.current = true;
        refreshSession().catch(ignoreAsyncError);
    }, [refreshSession]);

    return null;
};

export default AuthSessionBootstrap;

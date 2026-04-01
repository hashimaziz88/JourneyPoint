"use client";

import React, { useEffect } from "react";
import { Spin } from "antd";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/routes/auth.routes";
import withAuth from "@/hoc/withAuth";
import { useRouter } from "next/navigation";

const FacilitatorMarkdownImportPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace(APP_ROUTES.facilitatorPlanImport);
    }, [router]);

    return <Spin size="large" />;
};

export default withAuth(FacilitatorMarkdownImportPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});

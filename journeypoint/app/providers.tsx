"use client";

import React from "react";
import { ConfigProvider } from "antd";
import AuthSessionBootstrap from "@/components/auth/AuthSessionBootstrap";
import UserProviderScopeReset from "@/components/auth/UserProviderScopeReset";
import { themeSetup } from "@/constants/global/themeSetup";
import { AuthProvider } from "@/providers/authProvider";
import { RoleProvider } from "@/providers/roleProvider";
import { TenantProvider } from "@/providers/tenantProvider";
import { UserProvider } from "@/providers/userProvider";
import type { AppProvidersProps } from "@/types/app/providers";

/**
 * Composes the global JourneyPoint frontend providers in dependency order.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <ConfigProvider theme={themeSetup}>
    <AuthProvider>
      <AuthSessionBootstrap />
      <TenantProvider>
        <UserProvider>
          <UserProviderScopeReset />
          <RoleProvider>{children}</RoleProvider>
        </UserProvider>
      </TenantProvider>
    </AuthProvider>
  </ConfigProvider>
);

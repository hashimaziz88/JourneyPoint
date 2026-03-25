import React from "react"
import { themeSetup } from "@/constants/global/themeSetup"
import { ConfigProvider } from "antd"
import { AuthProvider } from "@/providers/authProvider"
import { UserProvider } from "@/providers/userProvider"
import { RoleProvider } from "@/providers/roleProvider"
import { TenantProvider } from "@/providers/tenantProvider"

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ConfigProvider theme={themeSetup}>
            <AuthProvider>
                <TenantProvider>
                    <UserProvider>
                        <RoleProvider>
                            {children}
                        </RoleProvider>
                    </UserProvider>
                </TenantProvider>
            </AuthProvider>
        </ConfigProvider>
    )
}

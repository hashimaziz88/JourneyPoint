import { themeSetup } from "@/constants/global/themeSetup"
import { ConfigProvider } from "antd"

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ConfigProvider theme={themeSetup}>
            {children}
        </ConfigProvider>
    )
}

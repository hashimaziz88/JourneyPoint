import type { MenuProps } from "antd";

/**
 * Defines the shared app-shell brand props.
 */
export interface IAppShellBrandProps {
    subtitle: string;
}

/**
 * Defines the mobile navigation drawer props for workspace shells.
 */
export interface IMobileNavigationProps {
    menuItems: NonNullable<MenuProps["items"]>;
    onNavigate: (href: string) => void;
    routeMap: Record<string, string>;
    selectedMenuKey: string;
    subtitle: string;
}

import type { MenuProps } from "antd";

/** Navigation icon key identifiers used to map keys to rendered icons. */
export type NavigationIconKey =
    | "dashboard"
    | "tenants"
    | "users"
    | "roles"
    | "plans"
    | "pipeline"
    | "facilitator"
    | "manager"
    | "enrolee"
    | "wellness";

/** A single workspace navigation item used in sidebar and top-nav menus. */
export type WorkspaceNavigationItem = {
    key: string;
    label: string;
    href: string;
    permission?: string;
    description: string;
    iconKey: NavigationIconKey;
};

/** Defines the shared app-shell brand props. */
export type AppShellBrandProps = {
    subtitle: string;
};

/** Defines the mobile navigation drawer props for workspace shells. */
export type MobileNavigationProps = {
    menuItems: NonNullable<MenuProps["items"]>;
    onNavigate: (href: string) => void;
    routeMap: Record<string, string>;
    selectedMenuKey: string;
    subtitle: string;
};

/** Defines the props for the top-navigation link row used in WorkspaceShell. */
export type WorkspaceNavLinksProps = {
    navigationItems: WorkspaceNavigationItem[];
    onNavigate: (href: string) => void;
    selectedMenuKey: string;
};

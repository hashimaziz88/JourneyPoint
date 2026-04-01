"use client";

import React, { startTransition, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { Button, Grid, Layout, Tag, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useAuthActions } from "@/providers/authProvider";
import MobileNavigation from "@/components/layout/MobileNavigation";
import WorkspaceNavLinks from "@/components/layout/WorkspaceNavLinks";
import { NAVIGATION_ICONS, getSelectedMenuKey } from "@/utils/layout/appShell";
import type { AppShellProps } from "@/types/layout/shell";
import { ignoreAsyncError } from "@/utils/async";
import { useWorkspaceShellStyles } from "./style/workspaceShell";

const { Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * Renders the top-navigation product shell for Facilitator, Manager, and Enrolee
 * workspaces. The admin workspace uses AppShell (sidebar) instead.
 */
const WorkspaceShell: React.FC<AppShellProps> = ({
  children,
  navigationItems,
  scopeLabel,
  subtitle,
  userDisplayName,
}) => {
  const { styles } = useWorkspaceShellStyles();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthActions();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const selectedMenuKey = getSelectedMenuKey(pathname, navigationItems);

  const menuItems = useMemo<NonNullable<MenuProps["items"]>>(
    () =>
      navigationItems.map((item) => ({
        key: item.key,
        icon: NAVIGATION_ICONS[item.iconKey],
        label: item.label,
      })),
    [navigationItems],
  );

  const routeMap = useMemo(
    () =>
      navigationItems.reduce<Record<string, string>>((map, item) => {
        map[item.key] = item.href;
        return map;
      }, {}),
    [navigationItems],
  );

  const navigateTo = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        router.replace(APP_ROUTES.login);
      })
      .catch(ignoreAsyncError);
  };

  return (
    <Layout className={styles.workspaceLayout}>
      <header className={styles.workspaceHeader}>
        {/* Left — logo + workspace context */}
        <div className={styles.headerLeft}>
          {isMobile && (
            <MobileNavigation
              menuItems={menuItems}
              onNavigate={navigateTo}
              routeMap={routeMap}
              selectedMenuKey={selectedMenuKey}
              subtitle={subtitle}
            />
          )}
          <Link href={APP_ROUTES.home} className={styles.headerLogo}>
            <Image
              src="/journeypoint.svg"
              alt="JourneyPoint"
              width={20}
              height={20}
              priority
            />
            <Text className={styles.headerLogoText}>JourneyPoint</Text>
          </Link>
          {!isMobile && (
            <>
              <div className={styles.headerDivider} />
              <Text className={styles.headerWorkspaceName}>{subtitle}</Text>
            </>
          )}
        </div>

        {/* Center — nav links (desktop only, hidden via CSS on mobile) */}
        <nav className={styles.headerCenter} aria-label="Workspace navigation">
          <WorkspaceNavLinks
            navigationItems={navigationItems}
            onNavigate={navigateTo}
            selectedMenuKey={selectedMenuKey}
          />
        </nav>

        {/* Right — context + user + logout */}
        <div className={styles.headerRight}>
          <Tag color={scopeLabel === "Host" ? "blue" : "gold"}>{scopeLabel}</Tag>
          {userDisplayName && (
            <Text className={styles.headerUserName}>{userDisplayName}</Text>
          )}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size="small"
          >
            {isMobile ? null : "Logout"}
          </Button>
        </div>
      </header>

      <Content className={styles.workspaceContent}>{children}</Content>
    </Layout>
  );
};

export default WorkspaceShell;

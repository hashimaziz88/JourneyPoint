"use client";

import React, { startTransition, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Grid, Layout, Menu, Space, Tag, Typography } from "antd";
import { APP_ROUTES } from "@/routes/auth.routes";
import { NAVIGATION_ICONS, getSelectedMenuKey } from "@/utils/layout/appShell";
import { useAuthActions } from "@/providers/authProvider";
import AppShellBrand from "@/components/layout/AppShellBrand";
import MobileNavigation from "@/components/layout/MobileNavigation";
import type { AppShellProps } from "@/types/layout/shell";
import { ignoreAsyncError } from "@/utils/async";
import { useStyles } from "./style/style";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * Renders the shared JourneyPoint workspace shell for host and tenant routes.
 */
const AppShell: React.FC<AppShellProps> = ({
  children,
  navigationItems,
  scopeLabel,
  subtitle,
  title,
  userDisplayName,
}) => {
  const { styles } = useStyles();
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
      navigationItems.reduce<Record<string, string>>((currentMap, item) => {
        currentMap[item.key] = item.href;
        return currentMap;
      }, {}),
    [navigationItems],
  );

  const navigateTo = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleNavigationClick: MenuProps["onClick"] = ({ key }) => {
    const href = routeMap[String(key)];
    if (href) {
      navigateTo(href);
    }
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        router.replace(APP_ROUTES.login);
      })
      .catch(ignoreAsyncError);
  };

  const navigationMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedMenuKey]}
      items={menuItems}
      onClick={handleNavigationClick}
      className={styles.shellMenu}
    />
  );

  return (
    <Layout className={styles.shellLayout}>
      {isMobile ? null : (
        <Sider breakpoint="lg" collapsedWidth="0" className={styles.shellSider}>
          <AppShellBrand subtitle={subtitle} />
          {navigationMenu}
        </Sider>
      )}

      <Layout>
        <Header className={styles.shellHeader}>
          <Space size="middle" align="start">
            {isMobile ? (
              <MobileNavigation
                menuItems={menuItems}
                onNavigate={navigateTo}
                routeMap={routeMap}
                selectedMenuKey={selectedMenuKey}
                subtitle={subtitle}
              />
            ) : null}

            <Space orientation="vertical" size={2}>
              <Title level={4} className={styles.headerTitle}>
                {title}
              </Title>
              <Space size={8} wrap>
                <Tag color={scopeLabel === "Host" ? "blue" : "gold"}>{scopeLabel}</Tag>
                {userDisplayName ? <Text type="secondary">{userDisplayName}</Text> : null}
              </Space>
            </Space>
          </Space>

          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content className={styles.shellContent}>
          <div className={styles.shellContentCard}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;

"use client";

import React, { startTransition, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import {
  ApartmentOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Space,
  Tag,
  Typography,
} from "antd";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import { APP_PERMISSIONS } from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/constants/auth/routes";
import { useAppSession } from "@/helpers/useAppSession";
import { useAuthActions } from "@/providers/authProvider";
import Spinner from "@/components/spinner/Spinner";
import { useStyles } from "@/components/admin/style/style";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const ignoreAsyncError = () => undefined;

const NAVIGATION_ICONS: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  tenants: <ApartmentOutlined />,
  users: <TeamOutlined />,
  roles: <SafetyCertificateOutlined />,
};

const NAVIGATION_ROUTE_MAP = ADMIN_NAVIGATION_ITEMS.reduce<Record<string, string>>((routeMap, item) => {
  routeMap[item.key] = item.href;
  return routeMap;
}, {});

const ROUTE_PERMISSION_MAP: Record<string, string | undefined> = {
  [APP_ROUTES.dashboard]: undefined,
  [APP_ROUTES.tenants]: APP_PERMISSIONS.tenants,
  [APP_ROUTES.users]: APP_PERMISSIONS.users,
  [APP_ROUTES.roles]: APP_PERMISSIONS.roles,
};

const getSelectedMenuKey = (pathname: string): string => {
  const sorted = [...ADMIN_NAVIGATION_ITEMS].sort((a, b) => b.href.length - a.href.length);
  const selectedItem = sorted.find((item) =>
    pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return selectedItem?.key ?? "dashboard";
};

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { styles } = useStyles();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthActions();
  const {
    defaultRoute,
    hasPermission,
    isAuthenticated,
    isReady,
    tenant,
    user,
  } = useAppSession();
  const requiredPermission = ROUTE_PERMISSION_MAP[pathname];
  const canAccessCurrentRoute = hasPermission(requiredPermission);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) {
      return;
    }

    if (requiredPermission && !canAccessCurrentRoute) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [canAccessCurrentRoute, defaultRoute, isAuthenticated, isReady, requiredPermission, router]);

  const navigationItems = useMemo(
    () => {
      const items: NonNullable<MenuProps["items"]> = [];

      for (const item of ADMIN_NAVIGATION_ITEMS) {
        if (hasPermission(item.permission)) {
          items.push({
            key: item.key,
            icon: NAVIGATION_ICONS[item.key],
            label: item.label,
          });
        }
      }

      return items;
    },
    [hasPermission],
  );

  if (!isReady) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigateTo = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleNavigationClick: MenuProps["onClick"] = ({ key }) => {
    const href = NAVIGATION_ROUTE_MAP[String(key)];
    if (href) {
      navigateTo(href);
    }
  };

  const handleLogout = () => {
    logout().catch(ignoreAsyncError);
  };

  return (
    <Layout className={styles.shellLayout}>
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.shellSider}>
        <div className={styles.siderBrand}>
          <Title level={3} className={styles.siderTitle}>
            JourneyPoint
          </Title>
          <Text className={styles.siderText}>
            {tenant?.tenancyName ? "Tenant Admin" : "Host Admin"}
          </Text>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[getSelectedMenuKey(pathname)]}
          items={navigationItems}
          onClick={handleNavigationClick}
          className={styles.shellMenu}
        />
      </Sider>

      <Layout>
        <Header className={styles.shellHeader}>
          <Space orientation="vertical" size={2}>
            <Title level={4} className={styles.headerTitle}>
              Admin Workspace
            </Title>
            <Space size={8} wrap>
              <Tag color={tenant?.tenancyName ? "gold" : "blue"}>
                {tenant?.tenancyName ? tenant.tenantName ?? tenant.tenancyName : "Host"}
              </Tag>
              {user?.fullName && <Text type="secondary">{user.fullName}</Text>}
            </Space>
          </Space>

          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content className={styles.shellContent}>
          <div className={styles.shellContentCard}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminShell;

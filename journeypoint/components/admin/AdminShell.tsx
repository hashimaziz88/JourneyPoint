"use client";

import React, { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import {
  ApartmentOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import { APP_PERMISSIONS } from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/constants/auth/routes";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import { clearTenantCookies, normalizeTenancyName } from "@/helpers/auth";
import { useAppSession } from "@/helpers/useAppSession";
import { useAuthActions } from "@/providers/authProvider";
import { removeCookie } from "@/utils/cookies";
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
  const selectedItem = ADMIN_NAVIGATION_ITEMS.find((item) =>
    pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return selectedItem?.key ?? "dashboard";
};

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { styles } = useStyles();
  const router = useRouter();
  const pathname = usePathname();
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [tenantSwitching, setTenantSwitching] = useState(false);
  const [tenantForm] = Form.useForm<{ tenancyName?: string }>();
  const { logout, resolveTenant } = useAuthActions();
  const session = useAppSession();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    if (session.isReady && !session.isAuthenticated) {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
    }
  }, [router, session.isAuthenticated, session.isReady]);

  useEffect(() => {
    if (!session.isReady || !session.isAuthenticated) {
      return;
    }

    const requiredPermission = ROUTE_PERMISSION_MAP[pathname];
    if (requiredPermission && !session.hasPermission(requiredPermission)) {
      startTransition(() => {
        router.replace(session.defaultRoute);
      });
    }
  }, [pathname, router, session]);

  const navigationItems = useMemo(
    () => {
      const items: NonNullable<MenuProps["items"]> = [];

      for (const item of ADMIN_NAVIGATION_ITEMS) {
        if (session.hasPermission(item.permission)) {
          items.push({
            key: item.key,
            icon: NAVIGATION_ICONS[item.key],
            label: item.label,
          });
        }
      }

      return items;
    },
    [session],
  );

  if (!session.isReady) {
    return <Spinner />;
  }

  if (!session.isAuthenticated) {
    return null;
  }

  const navigateTo = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const openTenantModal = () => {
    tenantForm.setFieldsValue({ tenancyName: session.tenant?.tenancyName ?? undefined });
    setTenantModalOpen(true);
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

  const handleTenantSwitch = async (values: { tenancyName?: string }) => {
    setTenantSwitching(true);

    try {
      const tenancyName = normalizeTenancyName(values.tenancyName);

      if (tenancyName) {
        const tenant = await resolveTenant(tenancyName);
        if (!tenant) {
          messageApi.error(`No tenant named "${tenancyName}" was found.`);
          return;
        }
      } else {
        clearTenantCookies();
      }

      removeCookie(AUTH_COOKIE_NAMES.token);
      setTenantModalOpen(false);
      tenantForm.resetFields();

      startTransition(() => {
        router.push(APP_ROUTES.login);
        router.refresh();
      });
    } finally {
      setTenantSwitching(false);
    }
  };

  return (
    <Layout className={styles.shellLayout}>
      {messageContextHolder}
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.shellSider}>
        <div className={styles.siderBrand}>
          <Title level={3} className={styles.siderTitle}>
            JourneyPoint
          </Title>
          <Text className={styles.siderText}>
            {session.tenant?.tenancyName ? "Tenant Admin" : "Host Admin"}
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
              <Tag color={session.tenant?.tenancyName ? "gold" : "blue"}>
                {session.tenant?.tenancyName ? session.tenant.tenantName ?? session.tenant.tenancyName : "Host"}
              </Tag>
              {session.user?.fullName && <Text type="secondary">{session.user.fullName}</Text>}
            </Space>
          </Space>

          <Space wrap>
            {session.isMultiTenancyEnabled && (
              <Button icon={<UserSwitchOutlined />} onClick={openTenantModal}>
                Change Tenant
              </Button>
            )}
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content className={styles.shellContent}>
          <div className={styles.shellContentCard}>
            {children}
          </div>
        </Content>
      </Layout>

      <Modal
        title="Change Tenant Context"
        open={tenantModalOpen}
        onCancel={() => setTenantModalOpen(false)}
        onOk={() => tenantForm.submit()}
        confirmLoading={tenantSwitching}
        okText="Switch"
      >
        <Form form={tenantForm} layout="vertical" onFinish={handleTenantSwitch}>
          <Form.Item label="Tenancy Name" name="tenancyName">
            <Input placeholder="Leave blank to switch to host" prefix={<ApartmentOutlined />} />
          </Form.Item>
          <Text type="secondary">
            Switching tenant clears the current token and sends you back to sign in for the new scope.
          </Text>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminShell;

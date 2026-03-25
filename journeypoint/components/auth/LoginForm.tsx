"use client";

import React, { useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Alert, Button, Checkbox, Form, Input, Space, Typography, message } from "antd";
import { ApartmentOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { clearTenantCookies } from "@/helpers/auth";
import { useAppSession } from "@/helpers/useAppSession";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { LoginFieldType } from "@/types/auth/formTypes";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;
const ignoreAsyncError = () => undefined;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { styles } = useStyles();
  const { login, resolveTenant } = useAuthActions();
  const authState = useAuthState();
  const { defaultRoute, isAuthenticated, isMultiTenancyEnabled, isReady, tenant } = useAppSession();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [defaultRoute, isAuthenticated, isReady, router]);

  useEffect(() => {
    if (authState.isError) {
      messageApi.error("Login failed. Please check your credentials and try again.");
    }
  }, [authState.isError, messageApi]);

  const submitLogin = async (values: LoginFieldType) => {
    const tenancyName = values.tenancyName?.trim();

    if (tenancyName) {
      const resolvedTenant = await resolveTenant(tenancyName);
      if (!resolvedTenant) {
        messageApi.error(`No tenant named "${tenancyName}" was found.`);
        return;
      }
    } else {
      clearTenantCookies();
    }

    await login({
      userNameOrEmailAddress: values.userNameOrEmailAddress ?? "",
      password: values.password ?? "",
      rememberClient: values.rememberClient ?? true,
    });
  };

  const onFinish: FormProps<LoginFieldType>["onFinish"] = (values) => {
    submitLogin(values).catch(ignoreAsyncError);
  };

  const onFinishFailed: FormProps<LoginFieldType>["onFinishFailed"] = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div className={styles.form}>
      {messageContextHolder}
      <Space orientation="vertical" size={4} className={styles.formHeader}>
        <Title level={2}>Welcome back</Title>
        <Text type="secondary">Sign in as a host admin or tenant admin.</Text>
      </Space>

      {isMultiTenancyEnabled && (
        <Alert
          type="info"
          showIcon
          className={styles.infoAlert}
          title={tenant?.tenancyName ? `Current tenant: ${tenant.tenantName ?? tenant.tenancyName}` : "Current scope: Host"}
          description="Leave the tenancy field blank for host access, or enter a tenant name to sign into that tenant."
        />
      )}

      <Form
        name="login"
        layout="vertical"
        initialValues={{
          rememberClient: true,
          tenancyName: tenant?.tenancyName ?? undefined,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {isMultiTenancyEnabled && (
          <Form.Item<LoginFieldType> label="Tenancy Name" name="tenancyName">
            <Input prefix={<ApartmentOutlined />} placeholder="Leave blank for host" size="large" />
          </Form.Item>
        )}

        <Form.Item<LoginFieldType>
          label="Email or Username"
          name="userNameOrEmailAddress"
          rules={[{ required: true, message: "Please enter your email or username." }]}
        >
          <Input prefix={<MailOutlined />} placeholder="admin or admin@example.com" size="large" />
        </Form.Item>

        <Form.Item<LoginFieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password." }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
        </Form.Item>

        <Form.Item<LoginFieldType> name="rememberClient" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={authState.isPending}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Text type="secondary" className={styles.footerText}>
        Need a tenant account? <Link href="/register">Register here</Link>
      </Text>
    </div>
  );
};

export default LoginForm;

"use client";

import React, { useEffect, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Alert, Button, Checkbox, Form, Input, Space, Typography, message } from "antd";
import { ApartmentOutlined, CheckCircleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAppSession } from "@/hooks/useAppSession";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { LoginFieldType } from "@/types/auth/formTypes";
import type { TenantResolveStatus } from "@/types/auth/login";
import { ignoreAsyncError } from "@/utils/async";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { styles } = useStyles();
  const { login, resolveTenant, clearTenant } = useAuthActions();
  const authState = useAuthState();
  const { defaultRoute, isAuthenticated, isMultiTenancyEnabled, isReady, tenant } = useAppSession();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [tenantStatus, setTenantStatus] = useState<TenantResolveStatus>("idle");
  const [form] = Form.useForm<LoginFieldType>();

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

  const handleChangeTenant = async () => {
    const tenancyName = form.getFieldValue("tenancyName")?.trim();
    if (!tenancyName) {
      setTenantStatus("idle");
      return;
    }
    setTenantStatus("resolving");
    const result = await resolveTenant(tenancyName).catch(() => null);
    setTenantStatus(result ? "resolved" : "not_found");
  };

  const handleContinueAsHost = () => {
    clearTenant();
    form.setFieldValue("tenancyName", undefined);
    setTenantStatus("idle");
  };

  const submitLogin = async (values: LoginFieldType) => {
    const tenancyName = values.tenancyName?.trim();

    if (tenancyName) {
      const resolvedTenant = await resolveTenant(tenancyName);
      if (!resolvedTenant) {
        messageApi.error(`No tenant named "${tenancyName}" was found.`);
        return;
      }
    } else {
      clearTenant();
    }

    await login({
      userNameOrEmailAddress: values.userNameOrEmailAddress ?? "",
      password: values.password ?? "",
      rememberClient: values.rememberClient ?? true,
      tenancyName: tenancyName ?? null,
    });
  };

  const onFinish: FormProps<LoginFieldType>["onFinish"] = (values) => {
    submitLogin(values).catch(ignoreAsyncError);
  };

  const onFinishFailed: FormProps<LoginFieldType>["onFinishFailed"] = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  let tenantValidateStatus: "" | "error" | "success" = "";
  if (tenantStatus === "not_found") tenantValidateStatus = "error";
  else if (tenantStatus === "resolved") tenantValidateStatus = "success";

  return (
    <div className={styles.form}>
      {messageContextHolder}
      <Space orientation="vertical" size={4} className={styles.formHeader}>
        <Title level={2}>Welcome back</Title>
        <Text type="secondary">Sign in with your host or tenant account.</Text>
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
        form={form}
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
          <>
            <Form.Item<LoginFieldType>
              label="Tenancy Name"
              name="tenancyName"
              validateStatus={tenantValidateStatus}
              help={tenantStatus === "not_found" ? "No tenant with that name was found." : undefined}
            >
              <Input
                prefix={<ApartmentOutlined />}
                suffix={tenantStatus === "resolved" ? <CheckCircleOutlined className={styles.tenantResolvedIcon} /> : null}
                placeholder="Enter tenant name"
                size="large"
                onChange={() => setTenantStatus("idle")}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  onClick={handleChangeTenant}
                  loading={tenantStatus === "resolving"}
                >
                  Change Tenant
                </Button>
                <Button onClick={handleContinueAsHost}>
                  Continue as Host
                </Button>
              </Space>
            </Form.Item>
          </>
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

    </div>
  );
};

export default LoginForm;

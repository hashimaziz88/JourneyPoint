"use client";

import React, { useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Alert, Button, Form, Input, Space, Typography, message } from "antd";
import { ApartmentOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAppSession } from "@/helpers/useAppSession";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { RegisterFieldType } from "@/types/auth/formTypes";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { styles } = useStyles();
  const { register, resolveTenant } = useAuthActions();
  const authState = useAuthState();
  const { defaultRoute, isAuthenticated, isMultiTenancyEnabled, isReady, tenant } = useAppSession();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [defaultRoute, isAuthenticated, isReady, router]);

  useEffect(() => {
    if (authState.isError) {
      message.error("Registration failed. Please review your details and try again.");
    }
  }, [authState.isError]);

  const onFinish: FormProps<RegisterFieldType>["onFinish"] = async (values) => {
    const tenancyName = values.tenancyName?.trim() ?? tenant?.tenancyName ?? "";
    if (!tenancyName) {
      message.error("Registration is tenant-scoped. Enter a tenancy name to continue.");
      return;
    }

    const resolvedTenant = await resolveTenant(tenancyName);
    if (!resolvedTenant) {
      message.error(`No tenant named "${tenancyName}" was found.`);
      return;
    }

    await register({
      name: values.name ?? "",
      surname: values.surname ?? "",
      userName: values.userName ?? "",
      emailAddress: values.emailAddress ?? "",
      password: values.password ?? "",
    });
  };

  const onFinishFailed: FormProps<RegisterFieldType>["onFinishFailed"] = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div className={styles.form}>
      <Space orientation="vertical" size={4} className={styles.formHeader}>
        <Title level={2}>Create account</Title>
        <Text type="secondary">Register inside a tenant so you can access its admin workspace.</Text>
      </Space>

      <Alert
        type="info"
        showIcon
        className={styles.infoAlert}
        title={tenant?.tenancyName ? `Registering for tenant: ${tenant.tenantName ?? tenant.tenancyName}` : "Tenant registration"}
        description="Self-registration is tenant-based. Host accounts should be created from the host admin workspace."
      />

      <Form
        name="register"
        layout="vertical"
        initialValues={{ tenancyName: tenant?.tenancyName ?? undefined }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {isMultiTenancyEnabled && (
          <Form.Item<RegisterFieldType>
            label="Tenancy Name"
            name="tenancyName"
            rules={[{ required: true, message: "Please enter the tenancy name." }]}
          >
            <Input prefix={<ApartmentOutlined />} placeholder="company-a" size="large" />
          </Form.Item>
        )}

        <Form.Item<RegisterFieldType>
          label="First Name"
          name="name"
          rules={[{ required: true, message: "Please enter your first name." }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Jane" size="large" />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Last Name"
          name="surname"
          rules={[{ required: true, message: "Please enter your last name." }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Doe" size="large" />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Username"
          name="userName"
          rules={[{ required: true, message: "Please enter a username." }]}
        >
          <Input prefix={<UserOutlined />} placeholder="janedoe" size="large" />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Email"
          name="emailAddress"
          rules={[
            { required: true, message: "Please enter your email address." },
            { type: "email", message: "Please enter a valid email address." },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="jane@example.com" size="large" />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please create a password." }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Create a password" size="large" />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={authState.isPending}
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Text type="secondary" className={styles.footerText}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Text>
    </div>
  );
};

export default RegisterForm;

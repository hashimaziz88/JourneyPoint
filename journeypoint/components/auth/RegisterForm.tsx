"use client";

import React, { useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Alert, Button, Form, Input, Space, Typography, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAppSession } from "@/hooks/useAppSession";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { RegisterFieldType } from "@/types/auth/formTypes";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { styles } = useStyles();
  const { register } = useAuthActions();
  const authState = useAuthState();
  const { defaultRoute, isAuthenticated, isReady, tenant } = useAppSession();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [defaultRoute, isAuthenticated, isReady, router]);

  useEffect(() => {
    if (isReady && !isAuthenticated && !tenant?.tenancyName) {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
    }
  }, [isReady, isAuthenticated, tenant, router]);

  useEffect(() => {
    if (authState.isError) {
      message.error("Registration failed. Please review your details and try again.");
    }
  }, [authState.isError]);

  const onFinish: FormProps<RegisterFieldType>["onFinish"] = async (values) => {
    const result = await register({
      name: values.name ?? "",
      surname: values.surname ?? "",
      userName: values.userName ?? "",
      emailAddress: values.emailAddress ?? "",
      password: values.password ?? "",
      tenancyName: tenant?.tenancyName ?? null,
    });

    if (result === "registered") {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
    }
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
        title={`Registering for tenant: ${tenant?.tenantName ?? tenant?.tenancyName ?? ""}`}
        description="Self-registration is tenant-based. Host accounts should be created from the host admin workspace."
      />

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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

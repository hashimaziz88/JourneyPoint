"use client";

import React from "react";
import Link from "next/link";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Space, Typography } from "antd";
import { LoginFieldType } from "@/types/auth/formTypes";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const { styles } = useStyles();

  const onFinish: FormProps<LoginFieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<LoginFieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.form}>
      <Space orientation="vertical" size={4} className={styles.formHeader}>
        <Title level={2}>Welcome back</Title>
        <Text type="secondary">Sign in to your account</Text>
      </Space>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<LoginFieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<LoginFieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<LoginFieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Text type="secondary" className={styles.footerText}>
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </Text>
    </div>
  );
};

export default LoginForm;

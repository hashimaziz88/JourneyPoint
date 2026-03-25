"use client";

import React from "react";
import Link from "next/link";
import type { FormProps } from "antd";
import { Button, Form, Input, Space, Typography } from "antd";
import { RegisterFieldType } from "@/types/auth/formTypes";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const RegisterForm: React.FC = () => {
  const { styles } = useStyles();

  const onFinish: FormProps<RegisterFieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<RegisterFieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.form}>
      <Space orientation="vertical" size={4} className={styles.formHeader}>
        <Title level={2}>Create account</Title>
        <Text type="secondary">Join us today</Text>
      </Space>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<RegisterFieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<RegisterFieldType>
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
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

"use client";

import React from "react";
import Link from "next/link";
import { Button, Flex, Space, Typography } from "antd";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { useStyles } from "./style/style";

const { Title, Text } = Typography;

const LandingActions: React.FC = () => {
  const { styles } = useStyles();

  return (
    <Flex vertical className={styles.content}>
      <Space orientation="vertical" size={4}>
        <Title level={2}>Get Started</Title>
        <Text type="secondary">Access your account or create a new one.</Text>
      </Space>

      <Flex vertical gap="middle" className={styles.buttonGroup}>
        <Link href="/login">
          <Button
            type="primary"
            block
            icon={<LoginOutlined />}
            className={styles.primaryButton}
          >
            Login
          </Button>
        </Link>

        <Link href="/register">
          <Button
            block
            icon={<UserAddOutlined />}
            className={styles.secondaryButton}
          >
            Register
          </Button>
        </Link>
      </Flex>

      <Text type="secondary" className={styles.footerText}>
        Start with a secure and structured application flow.
      </Text>
    </Flex>
  );
};

export default LandingActions;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Space, Typography } from "antd";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useStyles } from "@/layouts/style/style";
import type { AppShellBrandProps } from "@/types/layout/navigation";

const { Title, Text } = Typography;

/**
 * Renders the shared workspace navigation brand header.
 */
const AppShellBrand: React.FC<AppShellBrandProps> = ({ subtitle }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.siderBrand}>
      <Link href={APP_ROUTES.home}>
        <Space align="center" size={8} style={{ marginBottom: 4 }}>
          <Image
            src="/journeypoint.svg"
            alt="JourneyPoint"
            width={24}
            height={24}
            priority
          />
          <Title level={4} className={styles.siderTitle} style={{ margin: 0 }}>
            JourneyPoint
          </Title>
        </Space>
      </Link>
      <Text className={styles.siderText}>{subtitle}</Text>
    </div>
  );
};

export default AppShellBrand;

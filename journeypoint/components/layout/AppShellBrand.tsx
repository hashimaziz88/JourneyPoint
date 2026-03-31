"use client";

import React from "react";
import Image from "next/image";
import { Space, Typography } from "antd";
import { useStyles } from "@/layout/style/style";
import type { IAppShellBrandProps } from "@/types/layout/navigation";

const { Title, Text } = Typography;

/**
 * Renders the shared workspace navigation brand header.
 */
const AppShellBrand: React.FC<IAppShellBrandProps> = ({ subtitle }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.siderBrand}>
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
      <Text className={styles.siderText}>{subtitle}</Text>
    </div>
  );
};

export default AppShellBrand;

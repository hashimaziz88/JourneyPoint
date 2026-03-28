"use client";

import React from "react";
import { Typography } from "antd";
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
      <Title level={3} className={styles.siderTitle}>
        JourneyPoint
      </Title>
      <Text className={styles.siderText}>{subtitle}</Text>
    </div>
  );
};

export default AppShellBrand;

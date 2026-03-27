"use client";

import React from "react";
import { Typography } from "antd";
import { useStyles } from "@/layout/style/style";

const { Title, Text } = Typography;

interface IAppShellBrandProps {
  subtitle: string;
}

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

"use client";

import React from "react";
import { Flex, Spin } from "antd";
import { useStyles } from "@/components/admin/style/style";

const Spinner: React.FC = () => {
  const { styles } = useStyles();

  return (
    <Flex align="center" justify="center" className={styles.spinnerWrap}>
      <Spin size="large" />
    </Flex>
  );
};

export default Spinner;

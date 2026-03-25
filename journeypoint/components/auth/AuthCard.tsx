"use client";

import React from "react";
import Image from "next/image";
import { Card, Col, Row, Typography } from "antd";
import { useStyles } from "./style/style";
import { AuthCardProps } from "@/constants/auth/cardTypes";

const { Title, Paragraph } = Typography;

const AuthCard: React.FC<AuthCardProps> = ({ title, description, children }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.page}>
      <Card variant="borderless" className={styles.card}>
        <Row className={styles.heroRow}>
          <Col xs={24} md={12} className={styles.leftCol}>
            <div className={styles.leftContent}>
              <Image
                src="/next.svg"
                alt="JourneyPoint"
                width={100}
                height={24}
                priority
              />
              <Title level={1}>{title}</Title>
              <Paragraph>{description}</Paragraph>
            </div>
          </Col>

          <Col xs={24} md={12} className={styles.rightCol}>
            {children}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AuthCard;

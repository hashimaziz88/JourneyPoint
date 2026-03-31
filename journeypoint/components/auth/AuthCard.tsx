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
            <div className={styles.leftDecorator} />
            <div className={styles.leftContent}>
              <div className={styles.leftBrand}>
                <Image
                  src="/journeypoint.svg"
                  alt="JourneyPoint"
                  width={32}
                  height={32}
                  priority
                />
                <Title level={4} className={styles.leftBrandText}>
                  JourneyPoint
                </Title>
              </div>
              {title && <Title level={2}>{title}</Title>}
              {description && <Paragraph>{description}</Paragraph>}
              <Paragraph className={styles.leftTagline}>
                The structured onboarding platform for people-first teams.
              </Paragraph>
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

"use client";

import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import { useAppSession } from "@/helpers/useAppSession";
import { useStyles } from "@/components/admin/style/style";

const { Paragraph, Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
  const { styles } = useStyles();
  const session = useAppSession();

  return (
    <Space orientation="vertical" size={24} className={styles.overviewRoot}>
      <div>
        <Title level={2} className={styles.overviewHeading}>
          Welcome back
        </Title>
        <Paragraph type="secondary" className={styles.overviewParagraph}>
          You are working in the {session.tenant?.tenancyName ? "tenant" : "host"} scope.
          Use the sections below to manage tenants, users, and roles with the same multi-tenant flow as the Angular app.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Text type="secondary">Signed In As</Text>
            <Title level={4} className={styles.overviewCardTitle}>
              {session.user?.fullName ?? session.user?.userName ?? "Unknown user"}
            </Title>
            <Paragraph type="secondary" className={styles.overviewParagraph}>
              {session.user?.emailAddress ?? "No email returned from session."}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Text type="secondary">Current Scope</Text>
            <Title level={4} className={styles.overviewScopeTitle}>
              {session.tenant?.tenantName ?? "Host"}
            </Title>
            <Tag color={session.tenant?.tenancyName ? "gold" : "blue"}>
              {session.tenant?.tenancyName ?? "Host"}
            </Tag>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {ADMIN_NAVIGATION_ITEMS.filter((item) => session.hasPermission(item.permission)).map((item) => (
          <Col xs={24} md={12} xl={8} key={item.key}>
            <Card>
              <Title level={4}>{item.label}</Title>
              <Paragraph type="secondary" className={styles.overviewParagraph}>
                {item.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default DashboardOverview;

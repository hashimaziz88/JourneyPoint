"use client";

import React from "react";
import Link from "next/link";
import { Alert, Card, Col, Row, Space, Tag, Typography } from "antd";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import { NAVIGATION_ICONS } from "@/utils/layout/appShell";
import { useAppSession } from "@/hooks/useAppSession";
import { useStyles } from "@/components/admin/style/style";

const { Paragraph, Text, Title } = Typography;

const DashboardOverview: React.FC = () => {
  const { styles } = useStyles();
  const session = useAppSession();

  const isTenant = Boolean(session.tenant?.tenancyName);
  const scopeLabel = session.tenant?.tenantName ?? "Host";

  return (
    <Space orientation="vertical" size={24} className={styles.overviewRoot}>
      {/* Host scope safety notice */}
      {!isTenant && (
        <Alert
          className={styles.hostAlert}
          type="info"
          showIcon
          title="You are operating in host scope. Changes here affect the platform globally, not a specific tenant."
        />
      )}

      {/* Header */}
      <div>
        <Space align="center" size={8} className={styles.headingRow}>
          <Title level={2} className={`${styles.overviewHeading} ${styles.headingNoMargin}`}>
            Welcome back
          </Title>
          <Tag color={isTenant ? "gold" : "blue"}>{scopeLabel}</Tag>
        </Space>
        <Paragraph type="secondary" className={styles.overviewParagraph}>
          Use the sections below to manage platform access and administration within the current
          JourneyPoint scope.
        </Paragraph>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusBarItem}>
          <Text type="secondary" className={styles.statusBarLabel}>
            Signed in as
          </Text>
          <Text strong>
            {session.user?.fullName ?? session.user?.userName ?? "Unknown user"}
          </Text>
        </div>
        <div className={styles.statusBarDivider} />
        <div className={styles.statusBarItem}>
          <Text type="secondary" className={styles.statusBarLabel}>
            Email
          </Text>
          <Text>{session.user?.emailAddress ?? "—"}</Text>
        </div>
        <div className={styles.statusBarDivider} />
        <div className={styles.statusBarItem}>
          <Text type="secondary" className={styles.statusBarLabel}>
            Scope
          </Text>
          <Tag color={isTenant ? "gold" : "blue"} className={styles.statusBarTag}>
            {scopeLabel}
          </Tag>
        </div>
      </div>

      {/* Navigation cards */}
      <div>
        <Title level={4} className={styles.overviewHeading}>
          Administration
        </Title>
        <Row gutter={[16, 16]}>
          {ADMIN_NAVIGATION_ITEMS.filter((item) =>
            item.permission ? session.hasPermission(item.permission) : true,
          ).map((item) => (
            <Col xs={24} md={12} xl={8} key={item.key}>
              <Link href={item.href} className={styles.navCardLink}>
                <Card className={styles.navCard}>
                  <span className={styles.navCardIcon}>
                    {NAVIGATION_ICONS[item.iconKey]}
                  </span>
                  <Title level={5} className={styles.navCardTitle}>
                    {item.label}
                  </Title>
                  <Paragraph type="secondary" className={styles.overviewParagraph}>
                    {item.description}
                  </Paragraph>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Space>
  );
};

export default DashboardOverview;

"use client";

import React from "react";
import { Card, Col, Row, Space, Typography } from "antd";
import { useAppSession } from "@/hooks/useAppSession";
import type { WorkspaceOverviewProps } from "@/types/layout/shell";
import { useStyles } from "./style/style";

const { Paragraph, Title, Text } = Typography;

/**
 * Generic workspace placeholder for role workspaces that are not yet configured.
 */
const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({
  currentFocus,
  description,
  title,
}) => {
  const { styles } = useStyles();
  const session = useAppSession();

  return (
    <Space orientation="vertical" size={24} className={styles.overviewRoot}>
      <Card className={styles.overviewHeroCard}>
        <Text className={styles.overviewKicker}>Workspace Overview</Text>
        <Title level={2} className={styles.overviewHeading}>
          {title}
        </Title>
        <Paragraph type="secondary" className={styles.overviewParagraph}>
          {description}
        </Paragraph>
        <Text type="secondary" className={styles.overviewInlineMeta}>
          {session.user?.fullName ?? session.user?.userName ?? "Unknown user"} • {session.tenant?.tenantName ?? "Host"}
        </Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card className={styles.overviewDetailCard}>
            <Text type="secondary">Signed In As</Text>
            <Title level={4} className={styles.overviewCardTitle}>
              {session.user?.fullName ?? session.user?.userName ?? "Unknown user"}
            </Title>
            <Paragraph type="secondary" className={styles.overviewParagraph}>
              {session.user?.emailAddress ?? "—"}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className={styles.overviewDetailCard}>
            <Text type="secondary">Current Scope</Text>
            <Title level={4} className={styles.overviewCardTitle}>
              {session.tenant?.tenantName ?? "Host"}
            </Title>
            <Paragraph type="secondary" className={styles.overviewParagraph}>
              {currentFocus}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24}>
          <Card className={styles.overviewFocusCard}>
            <Text type="secondary">Current Focus</Text>
            <Title level={4} className={styles.overviewCardTitle}>
              {currentFocus}
            </Title>
            <Paragraph type="secondary" className={styles.overviewParagraph}>
              Keep navigating from the left menu to access role-specific actions and workflows.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default WorkspaceOverview;

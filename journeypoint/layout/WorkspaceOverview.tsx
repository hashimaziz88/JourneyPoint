"use client";

import React from "react";
import { Card, Col, Row, Space, Typography } from "antd";
import { useAppSession } from "@/helpers/useAppSession";
import type { IWorkspaceOverviewProps } from "@/types/layout/shell";
import { useStyles } from "./style/style";

const { Paragraph, Title, Text } = Typography;

/**
 * Renders the interim role workspace overview used during the foundation phase.
 */
const WorkspaceOverview: React.FC<IWorkspaceOverviewProps> = ({
  currentFocus,
  description,
  nextMilestoneHint,
  title,
}) => {
  const { styles } = useStyles();
  const session = useAppSession();

  return (
    <Space orientation="vertical" size={24} className={styles.overviewRoot}>
      <div>
        <Title level={2} className={styles.overviewHeading}>
          {title}
        </Title>
        <Paragraph type="secondary" className={styles.overviewParagraph}>
          {description}
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
            <Title level={4} className={styles.overviewCardTitle}>
              {session.tenant?.tenantName ?? "Host"}
            </Title>
            <Paragraph type="secondary" className={styles.overviewParagraph}>
              {currentFocus}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card>
        <Text type="secondary">Milestone One Focus</Text>
        <Title level={4} className={styles.overviewCardTitle}>
          {nextMilestoneHint}
        </Title>
        <Paragraph type="secondary" className={styles.overviewParagraph}>
          This workspace is intentionally light while role-safe routing, landing behavior, and navigation are being established.
        </Paragraph>
      </Card>
    </Space>
  );
};

export default WorkspaceOverview;

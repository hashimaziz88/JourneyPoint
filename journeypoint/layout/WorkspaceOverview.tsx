"use client";

import React from "react";
import { Card, Col, Row, Space, Typography } from "antd";
import { useAppSession } from "@/helpers/useAppSession";
import type { IWorkspaceOverviewProps } from "@/types/layout/shell";
import { useStyles } from "./style/style";

const { Paragraph, Title, Text } = Typography;

/**
 * Generic workspace placeholder for role workspaces that are not yet configured.
 */
const WorkspaceOverview: React.FC<IWorkspaceOverviewProps> = ({
  currentFocus,
  description,
  title,
}) => {
  const { styles } = useStyles();
  const session = useAppSession();

  return (
    <Space direction="vertical" size={24} className={styles.overviewRoot}>
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
              {session.user?.emailAddress ?? "—"}
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
    </Space>
  );
};

export default WorkspaceOverview;

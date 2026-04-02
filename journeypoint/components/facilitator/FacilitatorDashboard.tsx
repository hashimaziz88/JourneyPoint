"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, Col, Row, Spin, Statistic, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  ProfileOutlined,
  TeamOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useAppSession } from "@/hooks/useAppSession";
import {
  buildPipelineBoardRequest,
  fetchPipelineBoard,
  formatPercentage,
  getPipelineSummaryMetrics,
} from "@/utils/pipeline/board";
import type { PipelineSummaryMetrics } from "@/types/pipeline/components";
import { useStyles } from "./style/style";

const { Paragraph, Text, Title } = Typography;

const FEATURE_CARDS = [
  {
    icon: <ProfileOutlined />,
    title: "Onboarding Plans",
    description:
      "Author, publish, and clone structured onboarding plan templates. Import from documents or build module-by-module.",
    href: APP_ROUTES.facilitatorPlans,
    label: "Go to Plans",
  },
  {
    icon: <TeamOutlined />,
    title: "Hire Management",
    description:
      "Enrol new hires, assign onboarding plans, and monitor activation state, welcome delivery, and journey progress.",
    href: APP_ROUTES.facilitatorHires,
    label: "Go to Hires",
  },
  {
    icon: <DeploymentUnitOutlined />,
    title: "Live Pipeline",
    description:
      "Monitor active hires across all journey stages, track engagement health, and surface at-risk signals in real time.",
    href: APP_ROUTES.facilitatorPipeline,
    label: "Go to Pipeline",
  },
];

const FacilitatorDashboard: React.FC = () => {
  const { styles } = useStyles();
  const session = useAppSession();
  const [metrics, setMetrics] = useState<PipelineSummaryMetrics | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  const loadMetrics = useEffectEvent(async (): Promise<void> => {
    try {
      const request = buildPipelineBoardRequest({ keyword: "" });
      const board = await fetchPipelineBoard(request);
      setMetrics(getPipelineSummaryMetrics(board));
    } catch {
      // Non-blocking — dashboard still works without stats.
    } finally {
      setIsMetricsLoading(false);
    }
  });

  useEffect(() => {
    void loadMetrics();
  }, []);

  const displayName = session.user?.fullName ?? session.user?.userName ?? "there";
  const tenantName = session.tenant?.tenantName ?? null;

  return (
    <div className={styles.dashRoot}>
      {/* Greeting */}
      <div className={styles.greetingSection}>
        <Title level={2} className={styles.greetingTitle}>
          Welcome back, {displayName}.
        </Title>
        <Paragraph type="secondary" className={styles.greetingMeta}>
          {tenantName
            ? `You are working in the ${tenantName} workspace.`
            : "You are working in host scope."}
        </Paragraph>
      </div>

      {/* Pipeline snapshot */}
      {isMetricsLoading ? (
        <Spin size="small" />
      ) : metrics ? (
        <div className={styles.statsGrid}>
          <Card size="small">
            <Statistic title="Active Hires" value={metrics.totalHires} />
          </Card>
          <Card size="small">
            <Statistic
              title="At-Risk"
              value={metrics.activeAtRiskCount}
              prefix={metrics.activeAtRiskCount > 0 ? <WarningOutlined /> : undefined}
              styles={metrics.activeAtRiskCount > 0 ? { content: { color: "#EF4444" } } : undefined}
            />
          </Card>
          <Card size="small">
            <Statistic title="Avg Completion" value={formatPercentage(metrics.averageCompletionRate)} />
          </Card>
          <Card size="small">
            <Statistic title="Avg Engagement" value={formatPercentage(metrics.averageCompositeScore)} />
          </Card>
        </div>
      ) : null}

      {/* Feature hub */}
      <div>
        <Title level={4} className={styles.sectionHeading}>
          Your workspace
        </Title>
        <Row gutter={[20, 20]}>
          {FEATURE_CARDS.map((card) => (
            <Col xs={24} md={8} key={card.title}>
              <Card className={styles.featureCard}>
                <span className={styles.featureCardIcon}>{card.icon}</span>
                <Title level={4} className={styles.featureCardTitle}>
                  {card.title}
                </Title>
                <Paragraph className={styles.featureCardDescription}>
                  {card.description}
                </Paragraph>
                <Link href={card.href}>
                  <Button
                    type="link"
                    className={styles.featureCardAction}
                    icon={<ArrowRightOutlined />}
                    iconPlacement="end"
                  >
                    {card.label}
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Quick actions */}
      <div>
        <Title level={4} className={styles.sectionHeading}>
          Quick actions
        </Title>
        <div className={styles.quickActionsRow}>
          <Link href={APP_ROUTES.facilitatorPlanImport}>
            <Button icon={<UploadOutlined />}>Import Plan from Document</Button>
          </Link>
          <Link href={APP_ROUTES.facilitatorHires}>
            <Button icon={<TeamOutlined />}>Enrol a New Hire</Button>
          </Link>
          {tenantName && (
            <div className={styles.scopeChip}>
              <span>Tenant</span>
              <Tag color="gold" className={styles.scopeChipTag}>
                {tenantName}
              </Tag>
            </div>
          )}
        </div>
      </div>

      {/* Info strip */}
      <Card className={styles.infoCard} size="small">
        <Text className={styles.infoCardText}>
          Plans, hires, and pipeline are all live. Use the sidebar or the cards above to navigate
          between features. At-risk flags and engagement intelligence are available inside each
          hire&apos;s detail view.
        </Text>
      </Card>
    </div>
  );
};

export default FacilitatorDashboard;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Col, Row, Typography } from "antd";
import {
  DeploymentUnitOutlined,
  ProfileOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "@/constants/auth/routes";
import { useStyles } from "./style/landingPage";

const { Title, Paragraph, Text } = Typography;

const FEATURES = [
  {
    icon: <ProfileOutlined />,
    title: "Onboarding Plans",
    description:
      "Build structured, modular onboarding templates with facilitator-level control. Import from documents or author module-by-module.",
  },
  {
    icon: <TeamOutlined />,
    title: "Hire Management",
    description:
      "Enrol hires, assign plans, and track progress from activation through journey completion — with full welcome-delivery visibility.",
  },
  {
    icon: <DeploymentUnitOutlined />,
    title: "Live Pipeline",
    description:
      "Monitor every hire's journey stage, engagement health, and at-risk signals in real time from a single board view.",
  },
];

const STATS = [
  {
    value: "100%",
    label: "Structured",
    description: "Every onboarding backed by a formal plan",
  },
  {
    value: "4",
    label: "Role-aware workspaces",
    description: "Facilitator, Manager, Enrolee, and Admin",
  },
  {
    value: "Multi",
    label: "Tenant ready",
    description: "Each organisation gets its own isolated workspace",
  },
];

const LandingPage: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.landingRoot}>
      {/* Nav */}
      <nav className={styles.landingNav}>
        <div className={styles.navBrand}>
          <Image src="/journeypoint.svg" alt="JourneyPoint" width={28} height={28} priority />
          <Title level={4} className={styles.navBrandText}>
            JourneyPoint
          </Title>
        </div>
        <div className={styles.navActions}>
          <Link href={APP_ROUTES.login}>
            <Button type="primary" size="middle">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroEyebrow}>
          <RocketOutlined />
          Structured onboarding for people-first teams
        </div>
        <Title level={1} className={styles.heroTitle}>
          Onboarding that works — for everyone involved.
        </Title>
        <Paragraph className={styles.heroSubtitle}>
          JourneyPoint gives facilitators, managers, and hires a single workspace to plan,
          track, and complete onboarding journeys with full visibility at every stage.
        </Paragraph>
        <div className={styles.heroCtas}>
          <Link href={APP_ROUTES.login}>
            <Button type="primary" size="large">
              Get Started
            </Button>
          </Link>
          <a href="#features">
            <Button size="large">See What&apos;s Included</Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.featureSection}>
        <Text className={styles.sectionLabel}>Platform Features</Text>
        <Title level={2} className={styles.sectionTitle}>
          Everything your team needs to onboard well
        </Title>
        <Row gutter={[24, 24]}>
          {FEATURES.map((feature) => (
            <Col xs={24} md={8} key={feature.title}>
              <div className={styles.featureCard} style={{ padding: 24, borderRadius: 12, border: "1px solid" }}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <Title level={4} className={styles.featureCardTitle}>
                  {feature.title}
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {feature.description}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Stats */}
      <section className={styles.statSection}>
        <Row gutter={[24, 24]} justify="center">
          {STATS.map((stat) => (
            <Col xs={24} sm={8} key={stat.label}>
              <div className={styles.statItem}>
                <Title className={styles.statValue}>{stat.value}</Title>
                <Title level={5} className={styles.statLabel}>
                  {stat.label}
                </Title>
                <Text type="secondary">{stat.description}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <Title level={2} className={styles.ctaTitle}>
          Ready to run better onboarding?
        </Title>
        <Paragraph className={styles.ctaSubtitle}>
          Sign in with your account or contact your organisation&apos;s admin for access.
        </Paragraph>
        <Link href={APP_ROUTES.login}>
          <Button type="primary" size="large">
            Sign In to Your Workspace
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.pageFooter}>
        <div className={styles.footerBrand}>
          <Image src="/journeypoint.svg" alt="JourneyPoint" width={20} height={20} />
          <Title level={5} className={styles.footerBrandText}>
            JourneyPoint
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: 13 }}>
          © {new Date().getFullYear()} JourneyPoint. Structured onboarding for modern teams.
        </Text>
      </footer>
    </div>
  );
};

export default LandingPage;

"use client";

import React, { startTransition } from "react";
import { Alert, Button, Card, Space, Typography } from "antd";
import {
    CopyOutlined,
    ImportOutlined,
    RollbackOutlined,
    SaveOutlined,
    SendOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useStyles } from "@/components/plans/style/style";
import {
    OnboardingPlanStatus,
} from "@/types/onboarding-plan/onboarding-plan"
import {
    ONBOARDING_PLAN_STATUS_LABELS,
} from "@/constants/plans/onboarding-plan";
import { useRouter } from "next/navigation";
import type { PlanEditorHeaderProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the plan-editor heading, lifecycle actions, and new-plan entry choices.
 */
const PlanEditorHeader: React.FC<PlanEditorHeaderProps> = ({
    isDraftEditable,
    isMutationPending,
    isNewPlan,
    planId,
    planName,
    planStatus,
    showCreationChoice,
    onArchive,
    onClone,
    onPublish,
    onSave,
}) => {
    const { styles } = useStyles();
    const router = useRouter();

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        {isNewPlan ? "New Onboarding Plan" : planName || "Plan Editor"}
                    </Title>
                    <Paragraph type="secondary">
                        Keep the template structure ordered and lifecycle-safe for facilitators.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<RollbackOutlined />}
                        onClick={() =>
                            startTransition(() => router.push(APP_ROUTES.facilitatorPlans))
                        }
                    >
                        Back to Plans
                    </Button>
                    <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        onClick={() => void onSave()}
                        loading={isMutationPending}
                        disabled={!isDraftEditable}
                    >
                        Save Draft
                    </Button>
                    <Button
                        icon={<SendOutlined />}
                        onClick={() => void onPublish()}
                        loading={isMutationPending}
                        disabled={!planId || !isDraftEditable}
                    >
                        Publish
                    </Button>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => void onClone()}
                        loading={isMutationPending}
                        disabled={!planId}
                    >
                        Clone
                    </Button>
                    <Button
                        icon={<StopOutlined />}
                        danger
                        onClick={() => void onArchive()}
                        loading={isMutationPending}
                        disabled={!planId || planStatus === OnboardingPlanStatus.Archived}
                    >
                        Archive
                    </Button>
                </Space>
            </div>

            {isDraftEditable ? null : (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title={`This plan is ${ONBOARDING_PLAN_STATUS_LABELS[planStatus].toLowerCase()} and its structure is read-only.`}
                />
            )}

            {showCreationChoice ? (
                <Card className={styles.editorCard}>
                    <div className={styles.creationGrid}>
                        <Card className={styles.creationCard}>
                            <div className={styles.creationCardBody}>
                                <div>
                                    <Title level={4}>Build Manually</Title>
                                    <Paragraph type="secondary">
                                        Stay on this page to enter the plan details, add modules,
                                        and define tasks yourself.
                                    </Paragraph>
                                </div>

                                <Paragraph className={styles.creationAction} type="secondary">
                                    The editor below is already ready for manual authoring.
                                </Paragraph>
                            </div>
                        </Card>

                        <Card className={styles.creationCard}>
                            <div className={styles.creationCardBody}>
                                <div>
                                    <Title level={4}>Create From Document</Title>
                                    <Paragraph type="secondary">
                                        Upload markdown, text, PDF, or image content and let the
                                        backend normalize it into the same reviewable draft-plan
                                        DTO before save.
                                    </Paragraph>
                                </div>

                                <Button
                                    className={styles.creationAction}
                                    icon={<ImportOutlined />}
                                    onClick={() =>
                                        startTransition(() =>
                                            router.push(APP_ROUTES.facilitatorPlanImport),
                                        )
                                    }
                                >
                                    Open Document Import
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Card>
            ) : null}
        </>
    );
};

export default PlanEditorHeader;

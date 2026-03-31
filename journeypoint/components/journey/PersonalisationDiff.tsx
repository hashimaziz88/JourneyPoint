"use client";

import React, { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Empty,
    Input,
    Space,
    Statistic,
    Typography,
    message,
} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import PersonalisationDiffCard from "@/components/journey/PersonalisationDiffCard";
import { useStyles } from "@/components/journey/style/style";
import { PERSONALISATION_REQUEST_PLACEHOLDER } from "@/constants/journey/personalisation";
import { useHireActions } from "@/providers/hireProvider";
import {
    useJourneyActions,
    useJourneyState,
} from "@/providers/journeyProvider";
import type { IPersonalisationDiffProps } from "@/types/journey/components";
import { JourneyStatus } from "@/types/journey";
import { formatDisplayDateTime } from "@/utils/date";
import {
    getPersonalisationDecision,
    getPersonalisationDecisionCounts,
} from "@/utils/journey/personalisation";

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

/**
 * Drives facilitator AI-review requests and selective application for one journey.
 */
const PersonalisationDiff: React.FC<IPersonalisationDiffProps> = ({ hireId }) => {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [facilitatorInstructions, setFacilitatorInstructions] = useState("");
    const { getHireDetail } = useHireActions();
    const {
        applyPersonalisation,
        clearPersonalisationReview,
        requestPersonalisation,
        setPersonalisationDecision,
    } = useJourneyActions();
    const {
        isPersonalisationPending,
        journey,
        personalisationDecisions,
        personalisationProposal,
    } = useJourneyState();

    if (!journey) {
        return null;
    }

    const decisionCounts = getPersonalisationDecisionCounts(personalisationDecisions);
    const hasProposal = Boolean(personalisationProposal);
    const canApplyAcceptedDiffs = decisionCounts.acceptedCount > 0;
    const isDraftJourney = journey.status === JourneyStatus.Draft;

    const handleRequest = async (): Promise<void> => {
        if (!isDraftJourney) {
            messageApi.warning(
                "Journey personalisation is only available before journey activation.",
            );
            return;
        }

        const proposal = await requestPersonalisation({
            journeyId: journey.journeyId,
            facilitatorInstructions: facilitatorInstructions.trim() || null,
        });

        if (!proposal) {
            messageApi.error("AI personalisation could not be generated.");
            return;
        }

        messageApi.success("AI personalisation proposal ready for review.");
    };

    const handleApply = async (): Promise<void> => {
        if (!isDraftJourney) {
            messageApi.warning(
                "Journey personalisation is only available before journey activation.",
            );
            return;
        }

        const updatedJourney = await applyPersonalisation();

        if (!updatedJourney) {
            messageApi.error("No accepted AI changes were available to apply.");
            return;
        }

        messageApi.success("Accepted AI changes applied to the journey.");
        await getHireDetail(hireId);
    };

    return (
        <Card className={styles.sectionCard}>
            {messageContextHolder}
            <Space orientation="vertical" size={24} className={styles.fullWidthStack}>
                <div className={styles.personalisationHeader}>
                    <div>
                        <Title level={4} className={styles.pageHeading}>
                            AI Personalisation Review
                        </Title>
                        <Paragraph type="secondary">
                            Request Groq to suggest role-aware task revisions, then
                            accept only the changes you want to keep.
                        </Paragraph>
                    </div>

                    <Space wrap className={styles.personalisationDecisionSummary}>
                        <Button
                            icon={<RobotOutlined />}
                            loading={isPersonalisationPending}
                            disabled={!isDraftJourney}
                            onClick={() => void handleRequest()}
                        >
                            {hasProposal ? "Regenerate Proposal" : "Generate Proposal"}
                        </Button>
                        {hasProposal ? (
                            <Button disabled={!isDraftJourney} onClick={clearPersonalisationReview}>
                                Clear Review
                            </Button>
                        ) : null}
                        <Button
                            type="primary"
                            disabled={!isDraftJourney || !canApplyAcceptedDiffs}
                            loading={isPersonalisationPending}
                            onClick={() => void handleApply()}
                        >
                            Apply Accepted Changes
                        </Button>
                    </Space>
                </div>

                <TextArea
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className={styles.personalisationPrompt}
                    disabled={isPersonalisationPending || !isDraftJourney}
                    placeholder={PERSONALISATION_REQUEST_PLACEHOLDER}
                    value={facilitatorInstructions}
                    onChange={(event) => setFacilitatorInstructions(event.target.value)}
                />

                {isDraftJourney ? null : (
                    <Alert
                        type="warning"
                        showIcon
                        title="Personalisation unavailable after activation"
                        description="This hire's journey is already activated. AI personalisation can only be requested and applied while the journey remains in draft."
                    />
                )}

                {personalisationProposal ? (
                    <>
                        <Alert
                            type="info"
                            title="Review every suggestion before applying."
                            description="Only accepted task revisions will be applied. Rejected and unreviewed items will be ignored."
                        />

                        <div className={styles.summaryGrid}>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Model"
                                    value={personalisationProposal.modelName}
                                />
                            </Card>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Requested at"
                                    value={formatDisplayDateTime(
                                        personalisationProposal.requestedAt,
                                    )}
                                />
                            </Card>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Accepted"
                                    value={decisionCounts.acceptedCount}
                                />
                            </Card>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Unreviewed"
                                    value={decisionCounts.unreviewedCount}
                                />
                            </Card>
                        </div>

                        <div>
                            <Text strong>AI summary</Text>
                            <Paragraph>{personalisationProposal.summary}</Paragraph>
                        </div>

                        <div className={styles.personalisationDiffList}>
                            {personalisationProposal.diffs.map((diff) => (
                                <PersonalisationDiffCard
                                    key={diff.journeyTaskId}
                                    decision={getPersonalisationDecision(
                                        personalisationDecisions,
                                        diff.journeyTaskId,
                                    )}
                                    diff={diff}
                                    onDecisionChange={(journeyTaskId, decision) => {
                                        if (!isDraftJourney) {
                                            return;
                                        }

                                        setPersonalisationDecision(journeyTaskId, decision);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <Empty
                        className={styles.emptyState}
                        description={
                            isDraftJourney
                                ? "No AI proposal has been requested for this journey yet."
                                : "No personalisation review is available for activated journeys."
                        }
                    />
                )}
            </Space>
        </Card>
    );
};

export default PersonalisationDiff;

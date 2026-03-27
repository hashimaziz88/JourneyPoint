"use client";

import React from "react";
import { Button, Card, Empty, Space, Tag, Typography } from "antd";
import { useStyles } from "@/components/plans/style/style";
import type {
    IDocumentModuleOptionDto,
    IExtractedTaskProposalDto,
} from "@/types/onboarding-document";
import {
    EXTRACTED_TASK_REVIEW_STATUS_LABELS,
    ExtractedTaskReviewStatus,
} from "@/types/onboarding-document";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/types/onboarding-plan";

const { Paragraph, Title } = Typography;

const findOptionLabel = (
    options: ReadonlyArray<{ label: string; value: number }>,
    value: number,
): string => options.find((option) => option.value === value)?.label ?? "Unknown";

const getProposalStatusColor = (
    status: ExtractedTaskReviewStatus,
): "blue" | "green" | "red" | "default" => {
    if (status === ExtractedTaskReviewStatus.Accepted) {
        return "green";
    }

    if (status === ExtractedTaskReviewStatus.Rejected) {
        return "red";
    }

    if (status === ExtractedTaskReviewStatus.Pending) {
        return "blue";
    }

    return "default";
};

const getModuleName = (
    modules: IDocumentModuleOptionDto[],
    moduleId?: string | null,
): string => {
    if (!moduleId) {
        return "No module selected";
    }

    return modules.find((module) => module.id === moduleId)?.name ?? "Unknown module";
};

interface IExtractedProposalListProps {
    availableModules: IDocumentModuleOptionDto[];
    isPending: boolean;
    onAccept: (proposalId: string) => void;
    onEdit: (proposalId: string) => void;
    onReject: (proposalId: string) => Promise<void>;
    proposals: IExtractedTaskProposalDto[];
}

/**
 * Renders reviewable extracted-task proposals and exposes facilitator actions.
 */
const ExtractedProposalList: React.FC<IExtractedProposalListProps> = ({
    availableModules,
    isPending,
    onAccept,
    onEdit,
    onReject,
    proposals,
}) => {
    const { styles } = useStyles();

    if (proposals.length === 0) {
        return (
            <Empty
                className={styles.emptyState}
                description="No extracted task proposals are available for review yet."
            />
        );
    }

    return (
        <div className={styles.proposalGrid}>
            {proposals.map((proposal) => {
                const isApplied = proposal.reviewStatus === ExtractedTaskReviewStatus.Applied;

                return (
                    <Card key={proposal.id} className={styles.proposalCard}>
                        <div className={styles.proposalCardBody}>
                            <div className={styles.proposalCardHeader}>
                                <div>
                                    <Title level={4}>{proposal.title}</Title>
                                    <Paragraph type="secondary">
                                        {proposal.description}
                                    </Paragraph>
                                </div>

                                <Tag color={getProposalStatusColor(proposal.reviewStatus)}>
                                    {EXTRACTED_TASK_REVIEW_STATUS_LABELS[proposal.reviewStatus]}
                                </Tag>
                            </div>

                            <Space wrap className={styles.proposalMetaTags}>
                                <Tag>{getModuleName(availableModules, proposal.suggestedModuleId)}</Tag>
                                <Tag>
                                    {findOptionLabel(
                                        ONBOARDING_TASK_CATEGORY_OPTIONS,
                                        proposal.category,
                                    )}
                                </Tag>
                                <Tag>
                                    {findOptionLabel(
                                        ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
                                        proposal.assignmentTarget,
                                    )}
                                </Tag>
                                <Tag>
                                    {findOptionLabel(
                                        ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
                                        proposal.acknowledgementRule,
                                    )}
                                </Tag>
                                <Tag>Due +{proposal.dueDayOffset} days</Tag>
                            </Space>

                            <Space wrap className={styles.proposalActions}>
                                <Button
                                    onClick={() => onEdit(proposal.id)}
                                    disabled={isApplied || isPending}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => onAccept(proposal.id)}
                                    disabled={isApplied || isPending}
                                >
                                    Accept
                                </Button>
                                <Button
                                    danger
                                    onClick={() => {
                                        void onReject(proposal.id);
                                    }}
                                    disabled={isApplied || isPending}
                                >
                                    Reject
                                </Button>
                            </Space>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ExtractedProposalList;

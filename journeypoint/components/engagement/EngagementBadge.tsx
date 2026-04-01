"use client";

import React from "react";
import { Space, Tag } from "antd";
import {
    AT_RISK_BADGE_LABEL,
    ENGAGEMENT_CLASSIFICATION_COLORS,
    ENGAGEMENT_CLASSIFICATION_LABELS,
} from "@/constants/engagement/badge";
import type { EngagementBadgeProps } from "@/types/engagement/components";
import { formatPercentage } from "@/utils/pipeline/board";

/**
 * Renders engagement and at-risk status badges for facilitator intelligence views.
 */
const EngagementBadge: React.FC<EngagementBadgeProps> = ({
    classification,
    compositeScore,
    hasActiveAtRiskFlag,
    compact = false,
}) => (
    <Space wrap size={[8, 8]}>
        <Tag color={ENGAGEMENT_CLASSIFICATION_COLORS[classification]}>
            {ENGAGEMENT_CLASSIFICATION_LABELS[classification]}
        </Tag>
        {compact || compositeScore === undefined ? null : (
            <Tag>{formatPercentage(compositeScore)} score</Tag>
        )}
        {hasActiveAtRiskFlag ? <Tag color="error">{AT_RISK_BADGE_LABEL}</Tag> : null}
    </Space>
);

export default EngagementBadge;

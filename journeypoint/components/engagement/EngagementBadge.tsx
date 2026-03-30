"use client";

import React from "react";
import { Space, Tag } from "antd";
import {
    ENGAGEMENT_CLASSIFICATION_COLORS,
    ENGAGEMENT_CLASSIFICATION_LABELS,
} from "@/constants/pipeline/filters";
import type { IEngagementBadgeProps } from "@/types/pipeline/components";
import { formatPercentage } from "@/utils/pipeline/board";

/**
 * Renders engagement and at-risk status badges for facilitator intelligence views.
 */
const EngagementBadge: React.FC<IEngagementBadgeProps> = ({
    classification,
    compositeScore,
    hasActiveAtRiskFlag,
}) => (
    <Space wrap size={[8, 8]}>
        <Tag color={ENGAGEMENT_CLASSIFICATION_COLORS[classification]}>
            {ENGAGEMENT_CLASSIFICATION_LABELS[classification]}
        </Tag>
        <Tag>{formatPercentage(compositeScore)} score</Tag>
        {hasActiveAtRiskFlag ? <Tag color="error">At-risk flag active</Tag> : null}
    </Space>
);

export default EngagementBadge;

"use client";

import React from "react";
import { Tag } from "antd";
import { WellnessCheckInStatus } from "@/types/wellness/wellness";

const STATUS_COLORS: Record<WellnessCheckInStatus, string> = {
    [WellnessCheckInStatus.Pending]: "default",
    [WellnessCheckInStatus.InProgress]: "processing",
    [WellnessCheckInStatus.Completed]: "success",
};

const STATUS_LABELS: Record<WellnessCheckInStatus, string> = {
    [WellnessCheckInStatus.Pending]: "Pending",
    [WellnessCheckInStatus.InProgress]: "In Progress",
    [WellnessCheckInStatus.Completed]: "Completed",
};

interface WellnessStatusBadgeProps {
    status: WellnessCheckInStatus;
}

/**
 * Renders a colour-coded tag for a wellness check-in status.
 */
const WellnessStatusBadge: React.FC<WellnessStatusBadgeProps> = ({ status }) => (
    <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
);

export default WellnessStatusBadge;

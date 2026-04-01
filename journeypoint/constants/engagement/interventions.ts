import type { SelectProps } from "antd";
import { AtRiskFlagStatus, AtRiskResolutionType } from "@/types/engagement/engagement";

export const AT_RISK_FLAG_STATUS_LABELS: Record<AtRiskFlagStatus, string> = {
    [AtRiskFlagStatus.Active]: "Active",
    [AtRiskFlagStatus.Acknowledged]: "Acknowledged",
    [AtRiskFlagStatus.Resolved]: "Resolved",
};

export const AT_RISK_FLAG_STATUS_COLORS: Record<AtRiskFlagStatus, string> = {
    [AtRiskFlagStatus.Active]: "error",
    [AtRiskFlagStatus.Acknowledged]: "processing",
    [AtRiskFlagStatus.Resolved]: "success",
};

export const AT_RISK_RESOLUTION_LABELS: Record<AtRiskResolutionType, string> = {
    [AtRiskResolutionType.ManualFacilitatorResolution]: "Manual facilitator resolution",
    [AtRiskResolutionType.AutomaticHealthyRecovery]: "Automatic healthy recovery",
    [AtRiskResolutionType.HireExited]: "Hire exited",
};

export const FACILITATOR_RESOLUTION_OPTIONS: SelectProps["options"] = [
    {
        label: AT_RISK_RESOLUTION_LABELS[AtRiskResolutionType.ManualFacilitatorResolution],
        value: AtRiskResolutionType.ManualFacilitatorResolution,
    },
    {
        label: AT_RISK_RESOLUTION_LABELS[AtRiskResolutionType.HireExited],
        value: AtRiskResolutionType.HireExited,
    },
];

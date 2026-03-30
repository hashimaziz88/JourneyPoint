import type { SelectProps } from "antd";
import { EngagementClassification, type IPipelineBoardQueryState } from "@/types/pipeline";

export const DEFAULT_PIPELINE_QUERY_STATE: IPipelineBoardQueryState = {
    keyword: "",
    classification: undefined,
};

export const DEFAULT_PIPELINE_MAX_RESULT_COUNT = 200;

export const ENGAGEMENT_CLASSIFICATION_LABELS: Record<EngagementClassification, string> = {
    [EngagementClassification.Healthy]: "Healthy",
    [EngagementClassification.NeedsAttention]: "Needs Attention",
    [EngagementClassification.AtRisk]: "At Risk",
};

export const ENGAGEMENT_CLASSIFICATION_COLORS: Record<EngagementClassification, string> = {
    [EngagementClassification.Healthy]: "success",
    [EngagementClassification.NeedsAttention]: "warning",
    [EngagementClassification.AtRisk]: "error",
};

export const PIPELINE_CLASSIFICATION_OPTIONS: SelectProps["options"] = [
    {
        label: ENGAGEMENT_CLASSIFICATION_LABELS[EngagementClassification.Healthy],
        value: EngagementClassification.Healthy,
    },
    {
        label: ENGAGEMENT_CLASSIFICATION_LABELS[EngagementClassification.NeedsAttention],
        value: EngagementClassification.NeedsAttention,
    },
    {
        label: ENGAGEMENT_CLASSIFICATION_LABELS[EngagementClassification.AtRisk],
        value: EngagementClassification.AtRisk,
    },
];

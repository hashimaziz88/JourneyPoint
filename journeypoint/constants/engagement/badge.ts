import { EngagementClassification } from "@/types/engagement/engagement";

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

export const AT_RISK_BADGE_LABEL = "At-Risk Flag";

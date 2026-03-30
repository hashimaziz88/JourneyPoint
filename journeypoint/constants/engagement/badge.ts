import { EngagementClassification } from "@/types/engagement";

export const ENGAGEMENT_CLASSIFICATION_LABELS: Record<EngagementClassification, string> = {
    [EngagementClassification.Healthy]: "Healthy",
    [EngagementClassification.NeedsAttention]: "Needs Attention",
    [EngagementClassification.AtRisk]: "At Risk",
};

export const AT_RISK_BADGE_LABEL = "At-Risk Flag";

import type { EngagementClassification } from "@/types/engagement";

export interface IEngagementBadgeProps {
    classification: EngagementClassification;
    hasActiveAtRiskFlag?: boolean;
    compact?: boolean;
}

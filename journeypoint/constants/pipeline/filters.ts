import type { SelectProps } from "antd";
import {
    ENGAGEMENT_CLASSIFICATION_LABELS,
} from "@/constants/engagement/badge";
import { EngagementClassification } from "@/types/engagement/engagement";
import type { PipelineBoardQueryState } from "@/types/pipeline/pipeline";

export const DEFAULT_PIPELINE_QUERY_STATE: PipelineBoardQueryState = {
    keyword: "",
    classification: undefined,
};

export const DEFAULT_PIPELINE_MAX_RESULT_COUNT = 200;

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

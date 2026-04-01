import {
    JourneyStatus,
    JourneyTaskStatus,
    type EnroleeJourneyTaskListItemDto,
} from "@/types/journey/journey";
import { OnboardingTaskAcknowledgementRule } from "@/types/onboarding-plan/onboarding-plan";

export const ENROLEE_JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
    [JourneyStatus.Draft]: "Draft",
    [JourneyStatus.Active]: "Active",
    [JourneyStatus.Paused]: "Paused",
    [JourneyStatus.Completed]: "Completed",
};

export const ENROLEE_JOURNEY_STATUS_COLORS: Record<JourneyStatus, string> = {
    [JourneyStatus.Draft]: "gold",
    [JourneyStatus.Active]: "green",
    [JourneyStatus.Paused]: "orange",
    [JourneyStatus.Completed]: "blue",
};

export const JOURNEY_TASK_STATUS_LABELS: Record<JourneyTaskStatus, string> = {
    [JourneyTaskStatus.Pending]: "Pending",
    [JourneyTaskStatus.Completed]: "Completed",
};

export const JOURNEY_TASK_STATUS_COLORS: Record<JourneyTaskStatus, string> = {
    [JourneyTaskStatus.Pending]: "gold",
    [JourneyTaskStatus.Completed]: "green",
};

export const JOURNEY_TASK_PROGRESS_TEXT = (
    completedTaskCount: number,
    totalTaskCount: number,
): string => `${completedTaskCount}/${totalTaskCount} complete`;

export const needsAcknowledgementTag = (
    task: EnroleeJourneyTaskListItemDto,
): boolean =>
    task.acknowledgementRule === OnboardingTaskAcknowledgementRule.Required &&
    !task.acknowledgedAt;

import { OnboardingTaskAcknowledgementRule } from "@/types/onboarding-plan/onboarding-plan";
import type { EnroleeJourneyTaskDetailDto } from "@/types/journey/journey";

export const getCompletionPercent = (
    completedTaskCount: number,
    totalTaskCount: number,
): number => {
    if (totalTaskCount <= 0) {
        return 0;
    }

    return Math.round((completedTaskCount / totalTaskCount) * 100);
};

export const getAcknowledgementLabel = (
    acknowledgementRule: OnboardingTaskAcknowledgementRule,
): string =>
    acknowledgementRule === OnboardingTaskAcknowledgementRule.Required
        ? "Acknowledgement required"
        : "Acknowledgement optional";

export const canRenderTaskActions = (
    task: EnroleeJourneyTaskDetailDto | null | undefined,
): boolean => Boolean(task?.canAcknowledge || task?.canComplete);

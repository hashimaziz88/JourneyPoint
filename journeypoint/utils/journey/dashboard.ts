import { OnboardingTaskAcknowledgementRule } from "@/types/onboarding-plan";
import type { IEnroleeJourneyTaskDetailDto } from "@/types/journey";

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
    task: IEnroleeJourneyTaskDetailDto | null | undefined,
): boolean => Boolean(task?.canAcknowledge || task?.canComplete);

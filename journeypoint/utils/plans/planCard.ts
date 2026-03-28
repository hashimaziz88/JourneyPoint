import type { OnboardingPlanStatus } from "@/types/onboarding-plan";
import { OnboardingPlanStatus as PlanStatus } from "@/types/onboarding-plan";

export const formatPlanUpdatedTime = (value: string): string =>
    new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));

export const getPlanStatusColor = (
    status: OnboardingPlanStatus,
): "blue" | "green" | "default" => {
    if (status === PlanStatus.Published) {
        return "green";
    }

    if (status === PlanStatus.Draft) {
        return "blue";
    }

    return "default";
};

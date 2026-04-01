import type {
    JourneyPersonalisationChangedField,
    JourneyPersonalisationDecision,
} from "@/types/journey/journey";

export const PERSONALISATION_CHANGED_FIELD_LABELS: Record<
    JourneyPersonalisationChangedField,
    string
> = {
    title: "Title",
    description: "Description",
    category: "Category",
    assignmentTarget: "Assignment",
    acknowledgementRule: "Acknowledgement",
    dueDayOffset: "Due timing",
};

export const PERSONALISATION_DECISION_LABELS: Record<
    JourneyPersonalisationDecision,
    string
> = {
    unreviewed: "Unreviewed",
    accepted: "Accepted",
    rejected: "Rejected",
};

export const PERSONALISATION_DECISION_COLORS: Record<
    JourneyPersonalisationDecision,
    string
> = {
    unreviewed: "default",
    accepted: "success",
    rejected: "error",
};

export const PERSONALISATION_REQUEST_PLACEHOLDER =
    "Optional guidance for Groq, for example: focus on role-specific tasks, tighten due dates for week-one setup, or simplify orientation wording.";

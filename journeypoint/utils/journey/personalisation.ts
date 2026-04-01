import {
    PERSONALISATION_CHANGED_FIELD_LABELS,
} from "@/constants/journey/personalisation";
import { formatDisplayDate } from "@/utils/date";
import { findOptionLabel } from "@/utils/plans/optionLabels";
import type {
    ApplyJourneyPersonalisationRequest,
    JourneyPersonalisationDecisionItem,
    JourneyPersonalisationProposalDto,
    JourneyTaskPersonalisationDiffDto,
    JourneyPersonalisationChangedField,
    JourneyPersonalisationDecision,
} from "@/types/journey/journey";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/constants/plans/onboarding-plan";

interface IPersonalisationDecisionCounts {
    acceptedCount: number;
    rejectedCount: number;
    unreviewedCount: number;
}

export interface IPersonalisationFieldComparison {
    field: JourneyPersonalisationChangedField;
    label: string;
    currentValue: string;
    proposedValue: string;
}

export const buildInitialPersonalisationDecisions = (
    proposal: JourneyPersonalisationProposalDto,
): JourneyPersonalisationDecisionItem[] =>
    proposal.diffs.map((diff) => ({
        journeyTaskId: diff.journeyTaskId,
        decision: "unreviewed",
    }));

export const updatePersonalisationDecision = (
    decisions: JourneyPersonalisationDecisionItem[],
    journeyTaskId: string,
    decision: JourneyPersonalisationDecision,
): JourneyPersonalisationDecisionItem[] => {
    const hasExistingDecision = decisions.some(
        (existingDecision) => existingDecision.journeyTaskId === journeyTaskId,
    );

    if (!hasExistingDecision) {
        return [...decisions, { journeyTaskId, decision }];
    }

    return decisions.map((existingDecision) =>
        existingDecision.journeyTaskId === journeyTaskId
            ? { ...existingDecision, decision }
            : existingDecision,
    );
};

export const getPersonalisationDecision = (
    decisions: JourneyPersonalisationDecisionItem[],
    journeyTaskId: string,
): JourneyPersonalisationDecision =>
    decisions.find((decision) => decision.journeyTaskId === journeyTaskId)?.decision ??
    "unreviewed";

export const getPersonalisationDecisionCounts = (
    decisions: JourneyPersonalisationDecisionItem[],
): IPersonalisationDecisionCounts =>
    decisions.reduce<IPersonalisationDecisionCounts>(
        (counts, decision) => {
            switch (decision.decision) {
                case "accepted":
                    return {
                        ...counts,
                        acceptedCount: counts.acceptedCount + 1,
                    };
                case "rejected":
                    return {
                        ...counts,
                        rejectedCount: counts.rejectedCount + 1,
                    };
                default:
                    return {
                        ...counts,
                        unreviewedCount: counts.unreviewedCount + 1,
                    };
            }
        },
        {
            acceptedCount: 0,
            rejectedCount: 0,
            unreviewedCount: 0,
        },
    );

export const buildApplyPersonalisationRequest = (
    proposal: JourneyPersonalisationProposalDto | null | undefined,
    decisions: JourneyPersonalisationDecisionItem[],
): ApplyJourneyPersonalisationRequest | null => {
    if (!proposal) {
        return null;
    }

    const acceptedSelections = proposal.diffs
        .filter(
            (diff) =>
                getPersonalisationDecision(decisions, diff.journeyTaskId) === "accepted",
        )
        .map((diff) => ({
            journeyTaskId: diff.journeyTaskId,
            baselineSnapshotAt: diff.baselineSnapshotAt,
            title: diff.proposedTitle,
            description: diff.proposedDescription,
            category: diff.proposedCategory,
            assignmentTarget: diff.proposedAssignmentTarget,
            acknowledgementRule: diff.proposedAcknowledgementRule,
            dueDayOffset: diff.proposedDueDayOffset,
        }));

    if (acceptedSelections.length === 0) {
        return null;
    }

    return {
        journeyId: proposal.journeyId,
        generationLogId: proposal.generationLogId,
        selections: acceptedSelections,
    };
};

export const getHighlightedTaskIds = (
    proposal: JourneyPersonalisationProposalDto | null | undefined,
): string[] => proposal?.diffs.map((diff) => diff.journeyTaskId) ?? [];

export const getChangedFieldComparisons = (
    diff: JourneyTaskPersonalisationDiffDto,
): IPersonalisationFieldComparison[] =>
    diff.changedFields.map((field) => ({
        field,
        label: PERSONALISATION_CHANGED_FIELD_LABELS[field],
        currentValue: formatPersonalisationFieldValue(diff, field, false),
        proposedValue: formatPersonalisationFieldValue(diff, field, true),
    }));

const formatPersonalisationFieldValue = (
    diff: JourneyTaskPersonalisationDiffDto,
    field: JourneyPersonalisationChangedField,
    isProposedValue: boolean,
): string => {
    const taskCategory = isProposedValue ? diff.proposedCategory : diff.currentCategory;
    const assignmentTarget = isProposedValue
        ? diff.proposedAssignmentTarget
        : diff.currentAssignmentTarget;
    const acknowledgementRule = isProposedValue
        ? diff.proposedAcknowledgementRule
        : diff.currentAcknowledgementRule;
    const dueDayOffset = isProposedValue ? diff.proposedDueDayOffset : diff.currentDueDayOffset;
    const dueOn = isProposedValue ? diff.proposedDueOn : diff.currentDueOn;

    switch (field) {
        case "title":
            return isProposedValue ? diff.proposedTitle : diff.currentTitle;
        case "description":
            return isProposedValue
                ? diff.proposedDescription || "No description provided."
                : diff.currentDescription || "No description provided.";
        case "category":
            return findOptionLabel(ONBOARDING_TASK_CATEGORY_OPTIONS, taskCategory);
        case "assignmentTarget":
            return findOptionLabel(
                ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
                assignmentTarget,
            );
        case "acknowledgementRule":
            return findOptionLabel(
                ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
                acknowledgementRule,
            );
        case "dueDayOffset":
            return `Due day ${dueDayOffset} (${formatDisplayDate(dueOn)})`;
        default:
            return "";
    }
};

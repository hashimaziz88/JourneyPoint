import { DEFAULT_ADD_JOURNEY_TASK_REQUEST } from "@/constants/journey/review";
import type {
    AddJourneyTaskRequest,
    JourneyTaskReviewDto,
    UpdateJourneyTaskRequest,
} from "@/types/journey/journey";

export const mapJourneyTaskToEditorValues = (
    task?: JourneyTaskReviewDto | null,
): AddJourneyTaskRequest | UpdateJourneyTaskRequest =>
    task
        ? {
              moduleTitle: task.moduleTitle,
              moduleOrderIndex: task.moduleOrderIndex,
              taskOrderIndex: task.taskOrderIndex,
              title: task.title,
              description: task.description,
              category: task.category,
              assignmentTarget: task.assignmentTarget,
              acknowledgementRule: task.acknowledgementRule,
              dueDayOffset: task.dueDayOffset,
          }
        : {
              ...DEFAULT_ADD_JOURNEY_TASK_REQUEST,
          };

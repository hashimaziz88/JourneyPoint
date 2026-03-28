import { DEFAULT_ADD_JOURNEY_TASK_REQUEST } from "@/constants/journey/review";
import type {
    IAddJourneyTaskRequest,
    IJourneyTaskReviewDto,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";

export const mapJourneyTaskToEditorValues = (
    task?: IJourneyTaskReviewDto | null,
): IAddJourneyTaskRequest | IUpdateJourneyTaskRequest =>
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

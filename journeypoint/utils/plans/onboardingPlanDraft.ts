import type {
  OnboardingPlanDetailDto,
  OnboardingPlanDraft,
  OnboardingModuleDraft,
  OnboardingTaskDraft,
  OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan";
import { OnboardingPlanStatus } from "@/types/onboarding-plan/onboarding-plan";

const createClientKey = (): string =>
  typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const moveItem = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const clonedItems = [...items];
  const [movedItem] = clonedItems.splice(fromIndex, 1);
  clonedItems.splice(toIndex, 0, movedItem);
  return clonedItems;
};

const normalizeTasks = (
  tasks: OnboardingTaskDraft[],
): OnboardingTaskDraft[] =>
  tasks.map((task, index) => ({
    ...task,
    orderIndex: index + 1,
  }));

const normalizeModules = (
  modules: OnboardingModuleDraft[],
): OnboardingModuleDraft[] =>
  modules.map((module, index) => ({
    ...module,
    orderIndex: index + 1,
    tasks: normalizeTasks(module.tasks),
  }));

export const normalizeOnboardingPlanDetail = (
  detail: OnboardingPlanDetailDto,
): OnboardingPlanDetailDto => ({
  ...detail,
  modules: [...detail.modules]
    .sort((left, right) => left.orderIndex - right.orderIndex)
    .map((module) => ({
      ...module,
      tasks: [...module.tasks].sort(
        (left, right) => left.orderIndex - right.orderIndex,
      ),
    })),
});

export const mapOnboardingPlanDetailToDraft = (
  detail: OnboardingPlanDetailDto,
): OnboardingPlanDraft => ({
  id: detail.id,
  name: detail.name,
  description: detail.description,
  targetAudience: detail.targetAudience,
  durationDays: detail.durationDays,
  status: detail.status,
  modules: normalizeModules(
    detail.modules.map((module) => ({
      clientKey: module.id,
      id: module.id,
      name: module.name,
      description: module.description,
      orderIndex: module.orderIndex,
      tasks: module.tasks.map((task) => ({
        clientKey: task.id,
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        orderIndex: task.orderIndex,
        dueDayOffset: task.dueDayOffset,
        assignmentTarget: task.assignmentTarget,
        acknowledgementRule: task.acknowledgementRule,
      })),
    })),
  ),
});

export const createEmptyOnboardingPlanDraft = (): OnboardingPlanDraft => ({
  name: "",
  description: "",
  targetAudience: "",
  durationDays: 30,
  status: OnboardingPlanStatus.Draft,
  modules: [],
});

export const updateOnboardingPlanDraft = (
  draft: OnboardingPlanDraft | null | undefined,
  updater: (currentDraft: OnboardingPlanDraft) => OnboardingPlanDraft,
): OnboardingPlanDraft | null => {
  if (!draft) {
    return null;
  }

  return updater(draft);
};

export const applyOnboardingPlanDraftMetadata = (
  draft: OnboardingPlanDraft,
  payload: Partial<OnboardingPlanDraft>,
): OnboardingPlanDraft => ({
  ...draft,
  ...payload,
});

export const appendOnboardingPlanDraftModule = (
  draft: OnboardingPlanDraft,
): OnboardingPlanDraft => ({
  ...draft,
  modules: normalizeModules([
    ...draft.modules,
    {
      clientKey: createClientKey(),
      name: "",
      description: "",
      orderIndex: draft.modules.length + 1,
      tasks: [],
    },
  ]),
});

export const updateOnboardingPlanDraftModule = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  name: string,
  description: string,
): OnboardingPlanDraft => ({
  ...draft,
  modules: draft.modules.map((module) =>
    module.clientKey === moduleClientKey
      ? { ...module, name, description }
      : module,
  ),
});

export const removeOnboardingPlanDraftModule = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
): OnboardingPlanDraft => ({
  ...draft,
  modules: normalizeModules(
    draft.modules.filter((module) => module.clientKey !== moduleClientKey),
  ),
});

export const reorderOnboardingPlanDraftModule = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  direction: "up" | "down",
): OnboardingPlanDraft => {
  const currentIndex = draft.modules.findIndex(
    (module) => module.clientKey === moduleClientKey,
  );
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  return {
    ...draft,
    modules: normalizeModules(
      moveItem(draft.modules, currentIndex, targetIndex),
    ),
  };
};

export const appendOnboardingPlanDraftTask = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  payload: OnboardingTaskEditorValues,
): OnboardingPlanDraft => ({
  ...draft,
  modules: draft.modules.map((module) =>
    module.clientKey === moduleClientKey
      ? {
          ...module,
          tasks: normalizeTasks([
            ...module.tasks,
            {
              clientKey: createClientKey(),
              orderIndex: module.tasks.length + 1,
              ...payload,
            },
          ]),
        }
      : module,
  ),
});

export const updateOnboardingPlanDraftTask = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  taskClientKey: string,
  payload: OnboardingTaskEditorValues,
): OnboardingPlanDraft => ({
  ...draft,
  modules: draft.modules.map((module) =>
    module.clientKey === moduleClientKey
      ? {
          ...module,
          tasks: module.tasks.map((task) =>
            task.clientKey === taskClientKey ? { ...task, ...payload } : task,
          ),
        }
      : module,
  ),
});

export const removeOnboardingPlanDraftTask = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  taskClientKey: string,
): OnboardingPlanDraft => ({
  ...draft,
  modules: draft.modules.map((module) =>
    module.clientKey === moduleClientKey
      ? {
          ...module,
          tasks: normalizeTasks(
            module.tasks.filter((task) => task.clientKey !== taskClientKey),
          ),
        }
      : module,
  ),
});

export const reorderOnboardingPlanDraftTask = (
  draft: OnboardingPlanDraft,
  moduleClientKey: string,
  taskClientKey: string,
  direction: "up" | "down",
): OnboardingPlanDraft => ({
  ...draft,
  modules: draft.modules.map((module) => {
    if (module.clientKey !== moduleClientKey) {
      return module;
    }

    const currentIndex = module.tasks.findIndex(
      (task) => task.clientKey === taskClientKey,
    );
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    return {
      ...module,
      tasks: normalizeTasks(moveItem(module.tasks, currentIndex, targetIndex)),
    };
  }),
});

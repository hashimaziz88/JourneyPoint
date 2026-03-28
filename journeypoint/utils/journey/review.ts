import { JourneyStatus, type IJourneyDraftDto, type IJourneyModuleGroup } from "@/types/journey";

export const groupJourneyTasksByModule = (
    journey: IJourneyDraftDto | null | undefined,
): IJourneyModuleGroup[] => {
    if (!journey) {
        return [];
    }

    const moduleMap = new Map<string, IJourneyModuleGroup>();

    journey.tasks.forEach((task) => {
        const moduleKey = `${task.moduleOrderIndex}:${task.moduleTitle}`;
        const existingModule = moduleMap.get(moduleKey);

        if (existingModule) {
            existingModule.tasks.push(task);
            return;
        }

        moduleMap.set(moduleKey, {
            moduleKey,
            moduleTitle: task.moduleTitle,
            moduleOrderIndex: task.moduleOrderIndex,
            tasks: [task],
        });
    });

    return Array.from(moduleMap.values())
        .sort((left, right) => left.moduleOrderIndex - right.moduleOrderIndex)
        .map((module) => ({
            ...module,
            tasks: [...module.tasks].sort(
                (left, right) => left.taskOrderIndex - right.taskOrderIndex,
            ),
        }));
};

export const isJourneyDraftEditable = (
    journey: IJourneyDraftDto | null | undefined,
): boolean => journey?.status === JourneyStatus.Draft;

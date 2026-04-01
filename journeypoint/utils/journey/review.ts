import { JourneyStatus, type JourneyDraftDto, type JourneyModuleGroup } from "@/types/journey/journey";

export const groupJourneyTasksByModule = (
    journey: JourneyDraftDto | null | undefined,
): JourneyModuleGroup[] => {
    if (!journey) {
        return [];
    }

    const moduleMap = new Map<string, JourneyModuleGroup>();

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
    journey: JourneyDraftDto | null | undefined,
): boolean => journey?.status === JourneyStatus.Draft;

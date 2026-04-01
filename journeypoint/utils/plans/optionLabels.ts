import type { DocumentModuleOptionDto } from "@/types/onboarding-document/onboarding-document";

export const findOptionLabel = (
    options: ReadonlyArray<{ label: string; value: number }>,
    value: number,
): string => options.find((option) => option.value === value)?.label ?? "Unknown";

export const getModuleName = (
    modules: DocumentModuleOptionDto[],
    moduleId?: string | null,
): string => {
    if (!moduleId) {
        return "No module selected";
    }

    return modules.find((module) => module.id === moduleId)?.name ?? "Unknown module";
};

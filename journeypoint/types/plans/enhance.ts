export type EnhancedTaskProposalDto = {
  taskId: string;
  originalTitle: string;
  enhancedTitle: string;
  originalDescription: string;
  enhancedDescription: string;
};

export type EnhancedModuleProposalDto = {
  moduleId: string;
  originalName: string;
  enhancedName: string;
  originalDescription: string;
  enhancedDescription: string;
  tasks: EnhancedTaskProposalDto[];
};

export type PlanEnhancementProposalDto = {
  planId: string;
  modelName: string;
  modules: EnhancedModuleProposalDto[];
};

export type ApplyTaskEnhancement = {
  taskId: string;
  enhancedTitle: string;
  enhancedDescription: string;
};

export type ApplyModuleEnhancement = {
  moduleId: string;
  applyModuleContent: boolean;
  enhancedName: string;
  enhancedDescription: string;
  tasks: ApplyTaskEnhancement[];
};

export type ApplyPlanEnhancementRequest = {
  planId: string;
  modules: ApplyModuleEnhancement[];
};

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService
{
    /// <summary>
    /// Provides mapping and synchronization helpers for onboarding plan write operations.
    /// </summary>
    public partial class OnboardingPlanAppService
    {
        private void ApplyModuleInputs(OnboardingPlan plan, IEnumerable<UpsertOnboardingModuleDto> moduleInputs)
        {
            foreach (var moduleInput in OrderModules(moduleInputs))
            {
                var module = _onboardingPlanManager.CreateModule(
                    moduleInput.Name,
                    moduleInput.Description,
                    moduleInput.OrderIndex);
                _onboardingPlanManager.AddModule(plan, module);

                foreach (var taskInput in OrderTasks(moduleInput.Tasks))
                {
                    var task = CreateTask(taskInput);
                    _onboardingPlanManager.AddTask(plan, module.Id, task);
                }
            }
        }

        private async Task SyncModulesAsync(OnboardingPlan plan, IEnumerable<UpsertOnboardingModuleDto> moduleInputs)
        {
            var existingModuleIds = plan.Modules.Select(module => module.Id).ToHashSet();
            var orderedModuleInputs = OrderModules(moduleInputs).ToList();
            var requestedModuleIds = orderedModuleInputs
                .Where(module => module.Id.HasValue)
                .Select(module => module.Id.Value)
                .ToHashSet();

            foreach (var moduleInput in orderedModuleInputs)
            {
                if (moduleInput.Id.HasValue)
                {
                    _onboardingPlanManager.UpdateModule(
                        plan,
                        moduleInput.Id.Value,
                        moduleInput.Name,
                        moduleInput.Description,
                        moduleInput.OrderIndex);
                    var existingModule = plan.Modules.Single(module => module.Id == moduleInput.Id.Value);
                    await SyncTasksAsync(plan, existingModule, moduleInput.Tasks);
                    continue;
                }

                var newModule = _onboardingPlanManager.CreateModule(
                    moduleInput.Name,
                    moduleInput.Description,
                    moduleInput.OrderIndex);
                _onboardingPlanManager.AddModule(plan, newModule);
                await SyncTasksAsync(plan, newModule, moduleInput.Tasks);
            }

            var modulesToDelete = plan.Modules
                .Where(module => existingModuleIds.Contains(module.Id) && !requestedModuleIds.Contains(module.Id))
                .ToList();

            foreach (var module in modulesToDelete)
            {
                plan.Modules.Remove(module);
                await _onboardingModuleRepository.DeleteAsync(module);
            }
        }

        private async Task SyncTasksAsync(
            OnboardingPlan plan,
            OnboardingModule module,
            IEnumerable<UpsertOnboardingTaskDto> taskInputs)
        {
            var existingTaskIds = module.Tasks.Select(task => task.Id).ToHashSet();
            var orderedTaskInputs = OrderTasks(taskInputs).ToList();
            var requestedTaskIds = orderedTaskInputs
                .Where(task => task.Id.HasValue)
                .Select(task => task.Id.Value)
                .ToHashSet();

            foreach (var taskInput in orderedTaskInputs)
            {
                if (taskInput.Id.HasValue)
                {
                    _onboardingPlanManager.UpdateTask(
                        plan,
                        module.Id,
                        taskInput.Id.Value,
                        taskInput.Title,
                        taskInput.Description,
                        taskInput.Category,
                        taskInput.OrderIndex,
                        taskInput.DueDayOffset,
                        taskInput.AssignmentTarget,
                        taskInput.AcknowledgementRule);
                    continue;
                }

                var newTask = CreateTask(taskInput);
                _onboardingPlanManager.AddTask(plan, module.Id, newTask);
            }

            var tasksToDelete = module.Tasks
                .Where(task => existingTaskIds.Contains(task.Id) && !requestedTaskIds.Contains(task.Id))
                .ToList();

            foreach (var task in tasksToDelete)
            {
                module.Tasks.Remove(task);
                await _onboardingTaskRepository.DeleteAsync(task);
            }
        }

        private OnboardingTask CreateTask(UpsertOnboardingTaskDto taskInput)
        {
            return _onboardingPlanManager.CreateTask(
                taskInput.Title,
                taskInput.Description,
                taskInput.Category,
                taskInput.OrderIndex,
                taskInput.DueDayOffset,
                taskInput.AssignmentTarget,
                taskInput.AcknowledgementRule);
        }

        private static IEnumerable<UpsertOnboardingModuleDto> OrderModules(IEnumerable<UpsertOnboardingModuleDto> modules)
        {
            return (modules ?? Enumerable.Empty<UpsertOnboardingModuleDto>())
                .OrderBy(module => module.OrderIndex)
                .ThenBy(module => module.Id ?? Guid.Empty);
        }

        private static IEnumerable<UpsertOnboardingTaskDto> OrderTasks(IEnumerable<UpsertOnboardingTaskDto> tasks)
        {
            return (tasks ?? Enumerable.Empty<UpsertOnboardingTaskDto>())
                .OrderBy(task => task.OrderIndex)
                .ThenBy(task => task.Id ?? Guid.Empty);
        }

        private static OnboardingPlanDetailDto MapToDetailDto(OnboardingPlan plan)
        {
            return new OnboardingPlanDetailDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                TargetAudience = plan.TargetAudience,
                DurationDays = plan.DurationDays,
                Status = plan.Status,
                Modules = plan.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(MapModuleDto)
                    .ToList()
            };
        }

        private static OnboardingModuleDto MapModuleDto(OnboardingModule module)
        {
            return new OnboardingModuleDto
            {
                Id = module.Id,
                Name = module.Name,
                Description = module.Description,
                OrderIndex = module.OrderIndex,
                Tasks = module.Tasks
                    .OrderBy(task => task.OrderIndex)
                    .Select(MapTaskDto)
                    .ToList()
            };
        }

        private static OnboardingTaskDto MapTaskDto(OnboardingTask task)
        {
            return new OnboardingTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category,
                OrderIndex = task.OrderIndex,
                DueDayOffset = task.DueDayOffset,
                AssignmentTarget = task.AssignmentTarget,
                AcknowledgementRule = task.AcknowledgementRule
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Application.Services.JourneyService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Provides manager-safe task queries and completion actions for direct reports.
    /// </summary>
    public partial class JourneyAppService
    {
        /// <summary>
        /// Returns the current manager workspace grouped by direct report.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Manager)]
        public async Task<ManagerTaskWorkspaceDto> GetManagerTasksAsync()
        {
            var tasks = await GetManagerJourneyTasksAsync(GetRequiredTenantId(), GetRequiredUserId());
            return MapToManagerWorkspaceDto(tasks);
        }

        /// <summary>
        /// Returns one manager-assigned task for the current manager.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Manager)]
        public async Task<ManagerAssignedTaskDto> GetManagerTaskAsync(Guid journeyTaskId)
        {
            var journeyTask = await GetManagerJourneyTaskAsync(
                journeyTaskId,
                GetRequiredTenantId(),
                GetRequiredUserId());

            return MapToManagerTaskDto(journeyTask);
        }

        /// <summary>
        /// Completes one manager-assigned task for the current manager.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Manager)]
        public async Task<ManagerTaskWorkspaceDto> CompleteManagerTaskAsync(
            CompleteJourneyTaskRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var tenantId = GetRequiredTenantId();
            var userId = GetRequiredUserId();
            var journeyTask = await GetManagerJourneyTaskAsync(input.JourneyTaskId, tenantId, userId);

            _hireJourneyManager.CompleteManagerTask(
                journeyTask.Journey.Hire,
                journeyTask.Journey,
                journeyTask,
                userId);

            await CurrentUnitOfWork.SaveChangesAsync();

            var tasks = await GetManagerJourneyTasksAsync(tenantId, userId);
            return MapToManagerWorkspaceDto(tasks);
        }

        private async Task<List<JourneyTask>> GetManagerJourneyTasksAsync(int tenantId, long userId)
        {
            return await _journeyTaskRepository.GetAll()
                .Include(existingTask => existingTask.Journey)
                    .ThenInclude(journey => journey.Hire)
                .Where(existingTask =>
                    existingTask.TenantId == tenantId &&
                    existingTask.AssignmentTarget == OnboardingTaskAssignmentTarget.Manager &&
                    existingTask.Journey.Status == JourneyStatus.Active &&
                    existingTask.Journey.Hire.ManagerUserId == userId)
                .OrderBy(existingTask => existingTask.Journey.Hire.FullName)
                .ThenBy(existingTask => existingTask.ModuleOrderIndex)
                .ThenBy(existingTask => existingTask.TaskOrderIndex)
                .ToListAsync();
        }

        private async Task<JourneyTask> GetManagerJourneyTaskAsync(
            Guid journeyTaskId,
            int tenantId,
            long userId)
        {
            var journeyTask = await _journeyTaskRepository.GetAll()
                .Include(existingTask => existingTask.Journey)
                    .ThenInclude(journey => journey.Hire)
                .SingleOrDefaultAsync(existingTask =>
                    existingTask.Id == journeyTaskId &&
                    existingTask.TenantId == tenantId &&
                    existingTask.AssignmentTarget == OnboardingTaskAssignmentTarget.Manager &&
                    existingTask.Journey.Status == JourneyStatus.Active &&
                    existingTask.Journey.Hire.ManagerUserId == userId);

            if (journeyTask == null)
            {
                throw new EntityNotFoundException(typeof(JourneyTask), journeyTaskId);
            }

            return journeyTask;
        }

        private static ManagerTaskWorkspaceDto MapToManagerWorkspaceDto(
            IReadOnlyCollection<JourneyTask> journeyTasks)
        {
            var directReports = journeyTasks
                .GroupBy(journeyTask => journeyTask.Journey.HireId)
                .OrderBy(group => group.First().Journey.Hire.FullName)
                .Select(group =>
                {
                    var hire = group.First().Journey.Hire;
                    var tasks = group
                        .OrderBy(task => task.ModuleOrderIndex)
                        .ThenBy(task => task.TaskOrderIndex)
                        .Select(MapToManagerTaskDto)
                        .ToList();

                    return new ManagerDirectReportTaskGroupDto
                    {
                        HireId = hire.Id,
                        JourneyId = group.First().JourneyId,
                        HireFullName = hire.FullName,
                        RoleTitle = hire.RoleTitle,
                        Department = hire.Department,
                        PendingTaskCount = tasks.Count(task => task.Status == JourneyTaskStatus.Pending),
                        CompletedTaskCount = tasks.Count(task => task.Status == JourneyTaskStatus.Completed),
                        Tasks = tasks
                    };
                })
                .ToList();

            return new ManagerTaskWorkspaceDto
            {
                DirectReportCount = directReports.Count,
                TotalTaskCount = journeyTasks.Count,
                PendingTaskCount = journeyTasks.Count(task => task.Status == JourneyTaskStatus.Pending),
                CompletedTaskCount = journeyTasks.Count(task => task.Status == JourneyTaskStatus.Completed),
                OverdueTaskCount = journeyTasks.Count(IsOverdue),
                DirectReports = directReports
            };
        }

        private static ManagerAssignedTaskDto MapToManagerTaskDto(JourneyTask journeyTask)
        {
            return new ManagerAssignedTaskDto
            {
                JourneyTaskId = journeyTask.Id,
                JourneyId = journeyTask.JourneyId,
                HireId = journeyTask.Journey.HireId,
                HireFullName = journeyTask.Journey.Hire.FullName,
                RoleTitle = journeyTask.Journey.Hire.RoleTitle,
                Department = journeyTask.Journey.Hire.Department,
                ModuleTitle = journeyTask.ModuleTitle,
                ModuleOrderIndex = journeyTask.ModuleOrderIndex,
                TaskOrderIndex = journeyTask.TaskOrderIndex,
                Title = journeyTask.Title,
                Description = journeyTask.Description,
                DueOn = journeyTask.DueOn,
                Status = journeyTask.Status,
                CompletedAt = journeyTask.CompletedAt,
                IsOverdue = IsOverdue(journeyTask),
                IsPersonalised = journeyTask.PersonalisedAt.HasValue,
                PersonalisedAt = journeyTask.PersonalisedAt,
                CanComplete = journeyTask.Status == JourneyTaskStatus.Pending
            };
        }
    }
}

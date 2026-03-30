using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.JourneyService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.Audit;
using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Provides AI personalisation proposal and selective-apply workflows for journeys.
    /// </summary>
    public partial class JourneyAppService
    {
        /// <summary>
        /// Requests diff-ready AI personalisation revisions for one journey.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
        public async Task<JourneyPersonalisationProposalDto> RequestPersonalisationAsync(
            RequestJourneyPersonalisationRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var tenantId = GetRequiredTenantId();
            var journey = await GetJourneyForPersonalisationAsync(input.JourneyId, tenantId);
            var eligibleTasks = GetEligibleTasksForPersonalisation(journey);

            if (eligibleTasks.Count == 0)
            {
                throw new InvalidOperationException(
                    "Journey personalisation requires at least one pending task.");
            }

            var proposal = await _groqJourneyPersonalisationService.GenerateProposalAsync(
                journey.Hire,
                journey,
                journey.OnboardingPlan,
                eligibleTasks,
                input.FacilitatorInstructions);

            return MapToProposalDto(journey, proposal);
        }

        /// <summary>
        /// Applies selected AI personalisation revisions to one journey.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
        public async Task<JourneyDraftDto> ApplyPersonalisationAsync(
            ApplyJourneyPersonalisationRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var selections = NormalizeSelections(input.Selections);
            var tenantId = GetRequiredTenantId();
            var journey = await GetJourneyForPersonalisationAsync(input.JourneyId, tenantId);
            await EnsureMatchingPersonalisationLogAsync(
                input.GenerationLogId,
                tenantId,
                journey.HireId,
                journey.Id);

            foreach (var selection in selections)
            {
                var journeyTask = journey.Tasks.FirstOrDefault(task => task.Id == selection.JourneyTaskId);
                if (journeyTask == null)
                {
                    throw new EntityNotFoundException(typeof(JourneyTask), selection.JourneyTaskId);
                }

                _hireJourneyManager.ApplyPersonalisedTaskRevision(
                    journey.Hire,
                    journey,
                    journeyTask,
                    selection.BaselineSnapshotAt,
                    selection.Title,
                    selection.Description,
                    selection.Category,
                    selection.AssignmentTarget,
                    selection.AcknowledgementRule,
                    selection.DueDayOffset);
            }

            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToDraftDto(journey.Hire, journey);
        }

        private async Task<Journey> GetJourneyForPersonalisationAsync(Guid journeyId, int tenantId)
        {
            var journey = await _journeyRepository.GetAll()
                .Include(existingJourney => existingJourney.Hire)
                .Include(existingJourney => existingJourney.OnboardingPlan)
                .Include(existingJourney => existingJourney.Tasks)
                .SingleOrDefaultAsync(existingJourney =>
                    existingJourney.Id == journeyId &&
                    existingJourney.TenantId == tenantId);

            if (journey == null)
            {
                throw new EntityNotFoundException(typeof(Journey), journeyId);
            }

            if (journey.Status != JourneyStatus.Draft && journey.Status != JourneyStatus.Active)
            {
                throw new InvalidOperationException(
                    "Only draft or active journeys can be personalised.");
            }

            return journey;
        }

        private async Task EnsureMatchingPersonalisationLogAsync(
            Guid generationLogId,
            int tenantId,
            Guid hireId,
            Guid journeyId)
        {
            var generationLog = await _generationLogRepository.FirstOrDefaultAsync(generationLogId);
            if (generationLog == null)
            {
                throw new EntityNotFoundException(typeof(GenerationLog), generationLogId);
            }

            if (generationLog.TenantId != tenantId ||
                generationLog.WorkflowType != GenerationLogWorkflowType.Personalisation ||
                generationLog.Status != GenerationLogStatus.Succeeded ||
                generationLog.HireId != hireId ||
                generationLog.JourneyId != journeyId)
            {
                throw new InvalidOperationException(
                    "The provided personalisation audit record does not match the selected journey.");
            }
        }

        private static IReadOnlyList<JourneyTask> GetEligibleTasksForPersonalisation(Journey journey)
        {
            return journey.Tasks
                .Where(task => task.Status == JourneyTaskStatus.Pending)
                .OrderBy(task => task.ModuleOrderIndex)
                .ThenBy(task => task.TaskOrderIndex)
                .ToList();
        }

        private static IReadOnlyList<ApplyJourneyPersonalisationSelectionDto> NormalizeSelections(
            IReadOnlyList<ApplyJourneyPersonalisationSelectionDto> selections)
        {
            if (selections == null || selections.Count == 0)
            {
                throw new InvalidOperationException(
                    "At least one selected personalisation revision is required.");
            }

            var normalizedSelections = selections.ToList();
            var duplicateTaskIds = normalizedSelections
                .GroupBy(selection => selection.JourneyTaskId)
                .Where(group => group.Count() > 1)
                .Select(group => group.Key)
                .ToList();

            if (duplicateTaskIds.Count > 0)
            {
                throw new InvalidOperationException(
                    "Duplicate journey task selections are not allowed.");
            }

            return normalizedSelections;
        }

        private static JourneyPersonalisationProposalDto MapToProposalDto(
            Journey journey,
            GroqJourneyPersonalisationResult proposal)
        {
            var diffs = proposal.Revisions
                .Select(revision => MapToDiffDto(journey, revision))
                .ToList();

            return new JourneyPersonalisationProposalDto
            {
                GenerationLogId = proposal.GenerationLogId,
                HireId = journey.HireId,
                JourneyId = journey.Id,
                ModelName = proposal.ModelName,
                RequestedAt = proposal.RequestedAt,
                Summary = proposal.Summary,
                RevisedTaskCount = diffs.Count,
                Diffs = diffs
            };
        }

        private static JourneyTaskPersonalisationDiffDto MapToDiffDto(
            Journey journey,
            GroqJourneyTaskPersonalisationRevision revision)
        {
            var task = journey.Tasks.First(existingTask => existingTask.Id == revision.JourneyTaskId);
            var proposedDueOn = journey.Hire.StartDate.Date.AddDays(revision.DueDayOffset);

            return new JourneyTaskPersonalisationDiffDto
            {
                JourneyTaskId = task.Id,
                ModuleTitle = task.ModuleTitle,
                TaskOrderIndex = task.TaskOrderIndex,
                BaselineSnapshotAt = GetSnapshotTimestamp(task),
                CurrentTitle = task.Title,
                CurrentDescription = task.Description,
                CurrentCategory = task.Category,
                CurrentAssignmentTarget = task.AssignmentTarget,
                CurrentAcknowledgementRule = task.AcknowledgementRule,
                CurrentDueDayOffset = task.DueDayOffset,
                CurrentDueOn = task.DueOn,
                ProposedTitle = revision.Title,
                ProposedDescription = revision.Description,
                ProposedCategory = revision.Category,
                ProposedAssignmentTarget = revision.AssignmentTarget,
                ProposedAcknowledgementRule = revision.AcknowledgementRule,
                ProposedDueDayOffset = revision.DueDayOffset,
                ProposedDueOn = proposedDueOn,
                Rationale = revision.Rationale,
                ChangedFields = GetChangedFields(task, revision)
            };
        }

        private static IReadOnlyList<string> GetChangedFields(
            JourneyTask task,
            GroqJourneyTaskPersonalisationRevision revision)
        {
            var changedFields = new List<string>();

            AddChangedField(changedFields, task.Title != revision.Title, "title");
            AddChangedField(changedFields, task.Description != revision.Description, "description");
            AddChangedField(changedFields, task.Category != revision.Category, "category");
            AddChangedField(changedFields, task.AssignmentTarget != revision.AssignmentTarget, "assignmentTarget");
            AddChangedField(changedFields, task.AcknowledgementRule != revision.AcknowledgementRule, "acknowledgementRule");
            AddChangedField(changedFields, task.DueDayOffset != revision.DueDayOffset, "dueDayOffset");

            return changedFields;
        }

        private static void AddChangedField(
            ICollection<string> changedFields,
            bool hasChanged,
            string fieldName)
        {
            if (hasChanged)
            {
                changedFields.Add(fieldName);
            }
        }

        private static DateTime GetSnapshotTimestamp(JourneyTask journeyTask)
        {
            var snapshotAt = journeyTask.LastModificationTime ?? journeyTask.CreationTime;
            return snapshotAt.Kind switch
            {
                DateTimeKind.Utc => snapshotAt,
                DateTimeKind.Local => snapshotAt.ToUniversalTime(),
                _ => DateTime.SpecifyKind(snapshotAt, DateTimeKind.Utc)
            };
        }
    }
}

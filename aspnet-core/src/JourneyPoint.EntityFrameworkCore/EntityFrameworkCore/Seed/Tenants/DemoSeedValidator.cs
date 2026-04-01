using System;
using System.Collections.Generic;
using System.Linq;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;
using JourneyPoint.Domains.Engagement.Helpers;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using JourneyPoint.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Verifies that demo-tenant seed data satisfies the milestone walkthrough expectations.
    /// </summary>
    public class DemoSeedValidator
    {
        private readonly JourneyPointDbContext _context;
        private readonly EngagementScoreCalculator _engagementScoreService;

        /// <summary>
        /// Initializes the demo-seed validator.
        /// </summary>
        public DemoSeedValidator(JourneyPointDbContext context)
        {
            _context = context;
            _engagementScoreService = new EngagementScoreCalculator();
        }

        /// <summary>
        /// Validates that the seeded demo tenants expose the expected JourneyPoint product loop.
        /// </summary>
        public void Validate()
        {
            ValidateBoxfusion();
            ValidateDeptDemo();
        }

        private void ValidateBoxfusion()
        {
            var tenant = GetTenant("boxfusion");
            var hires = GetTenantHires(tenant.Id);

            if (hires.Count < 3)
            {
                throw new InvalidOperationException("Boxfusion demo seed must contain at least three hires.");
            }

            var classifications = hires
                .Where(hire => hire.Journey != null && hire.Journey.Status == JourneyStatus.Active)
                .ToDictionary(hire => hire.FullName, ComputeClassification);

            EnsureClassification(classifications, "Alex Mokoena", EngagementClassification.Healthy);
            EnsureClassification(classifications, "Nomsa Jacobs", EngagementClassification.NeedsAttention);
            EnsureClassification(classifications, "Thabo Ndlovu", EngagementClassification.AtRisk);

            var unresolvedFlagCount = _context.AtRiskFlags
                .IgnoreQueryFilters()
                .Count(flag => flag.TenantId == tenant.Id && flag.Status != AtRiskFlagStatus.Resolved);

            var resolvedFlagCount = _context.AtRiskFlags
                .IgnoreQueryFilters()
                .Count(flag => flag.TenantId == tenant.Id && flag.Status == AtRiskFlagStatus.Resolved);

            if (unresolvedFlagCount < 1 || resolvedFlagCount < 1)
            {
                throw new InvalidOperationException("Boxfusion demo seed must contain both unresolved and resolved intervention history.");
            }

            var hasManagerTasks = hires.Any(hire =>
                hire.Journey?.Tasks.Any(task => task.AssignmentTarget == OnboardingTaskAssignmentTarget.Manager) ?? false);

            if (!hasManagerTasks)
            {
                throw new InvalidOperationException("Boxfusion demo seed must contain manager-assigned tasks for direct-report validation.");
            }
        }

        private void ValidateDeptDemo()
        {
            var tenant = GetTenant("deptdemo");
            var hires = GetTenantHires(tenant.Id);

            if (!hires.Any(hire => hire.Status == HireLifecycleState.PendingActivation && hire.Journey?.Status == JourneyStatus.Draft))
            {
                throw new InvalidOperationException("DeptDemo demo seed must contain a pending-activation hire with a draft journey.");
            }

            if (!hires.Any(hire => hire.Status == HireLifecycleState.Completed && hire.Journey?.Status == JourneyStatus.Completed))
            {
                throw new InvalidOperationException("DeptDemo demo seed must contain a completed hire journey for completion-stage validation.");
            }

            if (!hires.Any(hire => hire.WelcomeNotificationStatus == WelcomeNotificationStatus.FailedRecoverable))
            {
                throw new InvalidOperationException("DeptDemo demo seed must retain a recoverable welcome-notification failure scenario.");
            }
        }

        private Tenant GetTenant(string tenancyName)
        {
            var tenant = _context.Tenants
                .IgnoreQueryFilters()
                .SingleOrDefault(existingTenant => existingTenant.TenancyName == tenancyName);

            return tenant ?? throw new InvalidOperationException($"Demo tenant '{tenancyName}' was not created.");
        }

        private List<Hire> GetTenantHires(int tenantId)
        {
            return _context.Hires
                .IgnoreQueryFilters()
                .Include(hire => hire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .Where(hire => hire.TenantId == tenantId)
                .ToList();
        }

        private EngagementClassification ComputeClassification(Hire hire)
        {
            var tasks = hire.Journey.Tasks
                .OrderBy(task => task.ModuleOrderIndex)
                .ThenBy(task => task.TaskOrderIndex)
                .ToList();

            var lastActivityAt = tasks
                .SelectMany(task => new[] { task.AcknowledgedAt, task.CompletedAt })
                .Where(timestamp => timestamp.HasValue)
                .Select(timestamp => timestamp!.Value)
                .DefaultIfEmpty(hire.StartDate)
                .Max();

            var input = new EngagementScoreInput
            {
                TotalTaskCount = tasks.Count,
                CompletedTaskCount = tasks.Count(task => task.Status == JourneyTaskStatus.Completed),
                OverdueTaskCount = tasks.Count(task => task.Status == JourneyTaskStatus.Pending && task.DueOn.Date < DateTime.UtcNow.Date),
                DaysSinceLastActivity = Math.Max(0, (DateTime.UtcNow.Date - lastActivityAt.Date).Days),
                ComputedAt = DateTime.UtcNow
            };

            return _engagementScoreService.Calculate(input).Classification;
        }

        private static void EnsureClassification(IReadOnlyDictionary<string, EngagementClassification> classifications, string hireName, EngagementClassification expectedClassification)
        {
            if (!classifications.TryGetValue(hireName, out var actualClassification) || actualClassification != expectedClassification)
            {
                throw new InvalidOperationException($"Demo hire '{hireName}' should score as '{expectedClassification}'.");
            }
        }
    }
}

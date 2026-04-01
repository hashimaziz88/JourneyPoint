using System;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using JourneyPoint.MultiTenancy;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Seeds the DeptDemo tenant with stage-varied demo journeys for milestone validation.
    /// </summary>
    public class DeptDemoDataBuilder : DemoTenantDataBuilderBase
    {
        /// <summary>
        /// Initializes the DeptDemo demo-data builder.
        /// </summary>
        public DeptDemoDataBuilder(JourneyPointDbContext context, Tenant tenant)
            : base(context, tenant)
        {
        }

        /// <summary>
        /// Creates the DeptDemo facilitator, manager, hire, and journey demo state.
        /// </summary>
        public override void Create()
        {
            var manager = EnsureUser("manager.deptdemo", "manager@deptdemo.demo", "Amos", "Mathebula", StaticRoleNames.Tenants.Manager);
            EnsureUser("facilitator.deptdemo", "facilitator@deptdemo.demo", "Naledi", "Peters", StaticRoleNames.Tenants.Facilitator);
            var ayandaUser = EnsureUser("ayanda.deptdemo", "ayanda@deptdemo.demo", "Ayanda", "Govender", StaticRoleNames.Tenants.Enrolee);
            var musaUser = EnsureUser("musa.deptdemo", "musa@deptdemo.demo", "Musa", "Dlamini", StaticRoleNames.Tenants.Enrolee);

            var plan = EnsurePublishedPlan(
                "DeptDemo Public Service Onboarding",
                "A reusable public-service onboarding pathway for citizen-facing programme teams.",
                "Public-sector programme hires",
                18);

            var complianceModule = EnsureModule(plan, 1, "Service Foundations", "Orient the hire to public-service standards and mandatory reading.");
            var deliveryModule = EnsureModule(plan, 2, "Citizen Delivery Practice", "Build hands-on service-delivery capability and guided shadowing.");
            var readinessModule = EnsureModule(plan, 3, "Readiness Sign-off", "Confirm readiness with manager and programme sign-off.");

            var securityBriefing = EnsureTemplateTask(complianceModule, 1, "Attend security briefing", "Join the mandatory information-security induction for the department.", OnboardingTaskCategory.Orientation, 0, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var ethicsPolicy = EnsureTemplateTask(complianceModule, 2, "Acknowledge ethics policy", "Read and acknowledge the ethics and citizen-service policy pack.", OnboardingTaskCategory.Learning, 1, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.Required);
            var officeSetup = EnsureTemplateTask(deliveryModule, 1, "Manager office setup review", "Manager confirms workstation, tools, and access readiness.", OnboardingTaskCategory.CheckIn, 3, OnboardingTaskAssignmentTarget.Manager, OnboardingTaskAcknowledgementRule.NotRequired);
            var serviceShadowing = EnsureTemplateTask(deliveryModule, 2, "Shadow service desk workflow", "Observe a live citizen-service workflow and capture follow-up questions.", OnboardingTaskCategory.Practice, 5, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var knowledgeCheck = EnsureTemplateTask(readinessModule, 1, "Complete knowledge check", "Finish the public-service readiness knowledge check.", OnboardingTaskCategory.Assessment, 7, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var readinessSignOff = EnsureTemplateTask(readinessModule, 2, "Manager readiness sign-off", "Manager signs off final onboarding readiness.", OnboardingTaskCategory.CheckIn, 10, OnboardingTaskAssignmentTarget.Manager, OnboardingTaskAcknowledgementRule.NotRequired);

            SeedDraftHire(plan, manager, ayandaUser, complianceModule, deliveryModule, readinessModule, securityBriefing, ethicsPolicy, officeSetup, serviceShadowing, knowledgeCheck, readinessSignOff);
            SeedCompletedHire(plan, manager, musaUser, complianceModule, deliveryModule, readinessModule, securityBriefing, ethicsPolicy, officeSetup, serviceShadowing, knowledgeCheck, readinessSignOff);
        }

        private void SeedDraftHire(OnboardingPlan plan, User manager, User enrolee, OnboardingModule complianceModule, OnboardingModule deliveryModule, OnboardingModule readinessModule, OnboardingTask securityBriefing, OnboardingTask ethicsPolicy, OnboardingTask officeSetup, OnboardingTask serviceShadowing, OnboardingTask knowledgeCheck, OnboardingTask readinessSignOff)
        {
            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(3);
            var hire = EnsureHire(plan, enrolee, manager, "Ayanda Govender", enrolee.EmailAddress, "Citizen Services Officer", "Field Operations", startDate, HireLifecycleState.PendingActivation, WelcomeNotificationStatus.FailedRecoverable, today.AddDays(-1), null, "SMTP demo relay unavailable during the initial welcome attempt.", null, null);
            var journey = EnsureJourney(hire, plan, JourneyStatus.Draft, null, null);

            EnsureJourneyTask(journey, startDate, securityBriefing, complianceModule, securityBriefing.Title, securityBriefing.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, ethicsPolicy, complianceModule, ethicsPolicy.Title, ethicsPolicy.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, officeSetup, deliveryModule, officeSetup.Title, officeSetup.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, serviceShadowing, deliveryModule, serviceShadowing.Title, serviceShadowing.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, knowledgeCheck, readinessModule, knowledgeCheck.Title, knowledgeCheck.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, readinessSignOff, readinessModule, readinessSignOff.Title, readinessSignOff.Description, JourneyTaskStatus.Pending, null, null, null, null);
        }

        private void SeedCompletedHire(OnboardingPlan plan, User manager, User enrolee, OnboardingModule complianceModule, OnboardingModule deliveryModule, OnboardingModule readinessModule, OnboardingTask securityBriefing, OnboardingTask ethicsPolicy, OnboardingTask officeSetup, OnboardingTask serviceShadowing, OnboardingTask knowledgeCheck, OnboardingTask readinessSignOff)
        {
            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(-16);
            var completedAt = today.AddDays(-2);
            var hire = EnsureHire(plan, enrolee, manager, "Musa Dlamini", enrolee.EmailAddress, "Programme Support Officer", "Citizen Experience", startDate, HireLifecycleState.Completed, WelcomeNotificationStatus.Sent, startDate, startDate, null, startDate, completedAt);
            var journey = EnsureJourney(hire, plan, JourneyStatus.Completed, startDate, completedAt);

            EnsureJourneyTask(journey, startDate, securityBriefing, complianceModule, securityBriefing.Title, securityBriefing.Description, JourneyTaskStatus.Completed, null, startDate, enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, ethicsPolicy, complianceModule, ethicsPolicy.Title, ethicsPolicy.Description, JourneyTaskStatus.Completed, startDate.AddDays(1), startDate.AddDays(1), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, officeSetup, deliveryModule, officeSetup.Title, officeSetup.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(3), manager.Id, null);
            EnsureJourneyTask(journey, startDate, serviceShadowing, deliveryModule, serviceShadowing.Title, serviceShadowing.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(5), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, knowledgeCheck, readinessModule, knowledgeCheck.Title, knowledgeCheck.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(7), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, readinessSignOff, readinessModule, readinessSignOff.Title, readinessSignOff.Description, JourneyTaskStatus.Completed, null, completedAt, manager.Id, null);

            EnsureHistoricalSnapshots(hire, journey, new[]
            {
                new SnapshotSeed(33.33m, 3, 1, 51.66m, EngagementClassification.NeedsAttention, today.AddDays(-12).AddHours(14)),
                new SnapshotSeed(66.67m, 1, 0, 83.34m, EngagementClassification.Healthy, today.AddDays(-8).AddHours(14)),
                new SnapshotSeed(100m, 1, 0, 100m, EngagementClassification.Healthy, today.AddDays(-3).AddHours(14))
            });
        }
    }
}

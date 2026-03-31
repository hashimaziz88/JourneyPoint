using System;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.MultiTenancy;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Seeds the Boxfusion tenant with milestone-ready demo onboarding data.
    /// </summary>
    public class BoxfusionDemoDataBuilder : DemoTenantDataBuilderBase
    {
        /// <summary>
        /// Initializes the Boxfusion demo-data builder.
        /// </summary>
        public BoxfusionDemoDataBuilder(JourneyPointDbContext context, Tenant tenant)
            : base(context, tenant)
        {
        }

        /// <summary>
        /// Creates the Boxfusion facilitator, manager, hire, journey, and engagement demo state.
        /// </summary>
        public override void Create()
        {
            var manager = EnsureUser("manager.boxfusion", "manager@boxfusion.demo", "Lerato", "Khumalo", StaticRoleNames.Tenants.Manager);
            EnsureUser("facilitator.boxfusion", "facilitator@boxfusion.demo", "Tandi", "Meyer", StaticRoleNames.Tenants.Facilitator);
            var alexUser = EnsureUser("alex.boxfusion", "alex@boxfusion.demo", "Alex", "Mokoena", StaticRoleNames.Tenants.Enrolee);
            var nomsaUser = EnsureUser("nomsa.boxfusion", "nomsa@boxfusion.demo", "Nomsa", "Jacobs", StaticRoleNames.Tenants.Enrolee);
            var thaboUser = EnsureUser("thabo.boxfusion", "thabo@boxfusion.demo", "Thabo", "Ndlovu", StaticRoleNames.Tenants.Enrolee);

            var plan = EnsurePublishedPlan(
                "Boxfusion Graduate Accelerator",
                "A reusable graduate onboarding programme for customer-facing consulting teams.",
                "Graduate hires",
                21);

            var welcomeModule = EnsureModule(plan, 1, "Welcome & Foundations", "Anchor the hire in the programme, values, and first-week context.");
            var integrationModule = EnsureModule(plan, 2, "Team Integration", "Connect the hire with their manager, onboarding buddy, and team rituals.");
            var practiceModule = EnsureModule(plan, 3, "Guided Practice", "Move the hire into structured learning and coached execution.");
            var capabilityModule = EnsureModule(plan, 4, "Capability Check", "Confirm readiness through review and capstone reflection.");

            var welcomeChecklist = EnsureTemplateTask(welcomeModule, 1, "Complete welcome checklist", "Finish the day-one admin, tooling, and workspace setup checklist.", OnboardingTaskCategory.Orientation, 0, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var cultureGuide = EnsureTemplateTask(welcomeModule, 2, "Review culture guide", "Read and acknowledge the Boxfusion culture and consulting expectations guide.", OnboardingTaskCategory.Learning, 1, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.Required);
            var kickoffCheckIn = EnsureTemplateTask(integrationModule, 1, "Manager kickoff check-in", "Meet with the direct manager to align on success measures and support needs.", OnboardingTaskCategory.CheckIn, 2, OnboardingTaskAssignmentTarget.Manager, OnboardingTaskAcknowledgementRule.NotRequired);
            var onboardingBuddy = EnsureTemplateTask(integrationModule, 2, "Meet your onboarding buddy", "Book a guided handover with the nominated onboarding buddy.", OnboardingTaskCategory.Practice, 4, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var sandboxExercise = EnsureTemplateTask(practiceModule, 1, "Complete sandbox exercise", "Work through the first sandbox delivery simulation with facilitator notes.", OnboardingTaskCategory.Practice, 6, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);
            var reflection = EnsureTemplateTask(practiceModule, 2, "Submit first-week reflection", "Capture progress, blockers, and confidence after the first practice sprint.", OnboardingTaskCategory.Assessment, 8, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.Required);
            var managerReview = EnsureTemplateTask(capabilityModule, 1, "Manager progress review", "Review readiness signals and unblock any remaining onboarding issues.", OnboardingTaskCategory.CheckIn, 10, OnboardingTaskAssignmentTarget.Manager, OnboardingTaskAcknowledgementRule.NotRequired);
            var capstoneRecap = EnsureTemplateTask(capabilityModule, 2, "Present capstone recap", "Share the capstone recap and key takeaways with the facilitator.", OnboardingTaskCategory.Assessment, 12, OnboardingTaskAssignmentTarget.Enrolee, OnboardingTaskAcknowledgementRule.NotRequired);

            SeedEngagedHire(plan, manager, alexUser, welcomeModule, integrationModule, practiceModule, capabilityModule, welcomeChecklist, cultureGuide, kickoffCheckIn, onboardingBuddy, sandboxExercise, reflection, managerReview, capstoneRecap);
            SeedNeedsAttentionHire(plan, manager, nomsaUser, welcomeModule, integrationModule, practiceModule, capabilityModule, welcomeChecklist, cultureGuide, kickoffCheckIn, onboardingBuddy, sandboxExercise, reflection, managerReview, capstoneRecap);
            SeedAtRiskHire(plan, manager, thaboUser, welcomeModule, integrationModule, practiceModule, capabilityModule, welcomeChecklist, cultureGuide, kickoffCheckIn, onboardingBuddy, sandboxExercise, reflection, managerReview, capstoneRecap);
        }

        private void SeedEngagedHire(OnboardingPlan plan, User manager, User enrolee, OnboardingModule welcomeModule, OnboardingModule integrationModule, OnboardingModule practiceModule, OnboardingModule capabilityModule, OnboardingTask welcomeChecklist, OnboardingTask cultureGuide, OnboardingTask kickoffCheckIn, OnboardingTask onboardingBuddy, OnboardingTask sandboxExercise, OnboardingTask reflection, OnboardingTask managerReview, OnboardingTask capstoneRecap)
        {
            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(-7);
            var hire = EnsureHire(plan, enrolee, manager, "Alex Mokoena", enrolee.EmailAddress, "Associate Consultant", "Customer Success", startDate, HireLifecycleState.Active, WelcomeNotificationStatus.Sent, startDate, startDate, null, startDate, null);
            var journey = EnsureJourney(hire, plan, JourneyStatus.Active, startDate, null);

            EnsureJourneyTask(journey, startDate, welcomeChecklist, welcomeModule, welcomeChecklist.Title, welcomeChecklist.Description, JourneyTaskStatus.Completed, null, startDate, enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, cultureGuide, welcomeModule, cultureGuide.Title, cultureGuide.Description, JourneyTaskStatus.Completed, startDate.AddDays(1), startDate.AddDays(1), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, kickoffCheckIn, integrationModule, kickoffCheckIn.Title, kickoffCheckIn.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(2), manager.Id, null);
            EnsureJourneyTask(journey, startDate, onboardingBuddy, integrationModule, onboardingBuddy.Title, onboardingBuddy.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(3), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, sandboxExercise, practiceModule, practiceModule.Name + " sandbox exercise", sandboxExercise.Description, JourneyTaskStatus.Completed, null, today.AddDays(-1), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, reflection, practiceModule, reflection.Title, reflection.Description, JourneyTaskStatus.Pending, null, null, null, today.AddDays(-1));
            EnsureJourneyTask(journey, startDate, managerReview, capabilityModule, managerReview.Title, managerReview.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, capstoneRecap, capabilityModule, capstoneRecap.Title, capstoneRecap.Description, JourneyTaskStatus.Pending, null, null, null, null);

            EnsureHistoricalSnapshots(hire, journey, new[]
            {
                new SnapshotSeed(12.5m, 6, 3, 26.39m, EngagementClassification.AtRisk, today.AddDays(-10).AddHours(10)),
                new SnapshotSeed(37.5m, 3, 2, 51.07m, EngagementClassification.NeedsAttention, today.AddDays(-7).AddHours(10)),
                new SnapshotSeed(50m, 2, 1, 68.21m, EngagementClassification.NeedsAttention, today.AddDays(-4).AddHours(10)),
                new SnapshotSeed(62.5m, 1, 0, 79.11m, EngagementClassification.Healthy, today.AddDays(-2).AddHours(10))
            });

            EnsureResolvedFlag(
                hire,
                journey,
                today.AddDays(-10).AddHours(9),
                today.AddDays(-9).AddHours(8),
                today.AddDays(-3).AddHours(16),
                manager.Id,
                manager.Id,
                "Manager scheduled a focused support cadence after the first-week check-in.",
                "Recovered after focused coaching and completion of the guided practice backlog.",
                AtRiskResolutionType.ManualFacilitatorResolution);
        }

        private void SeedNeedsAttentionHire(OnboardingPlan plan, User manager, User enrolee, OnboardingModule welcomeModule, OnboardingModule integrationModule, OnboardingModule practiceModule, OnboardingModule capabilityModule, OnboardingTask welcomeChecklist, OnboardingTask cultureGuide, OnboardingTask kickoffCheckIn, OnboardingTask onboardingBuddy, OnboardingTask sandboxExercise, OnboardingTask reflection, OnboardingTask managerReview, OnboardingTask capstoneRecap)
        {
            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(-8);
            var hire = EnsureHire(plan, enrolee, manager, "Nomsa Jacobs", enrolee.EmailAddress, "Business Analyst", "Advisory", startDate, HireLifecycleState.Active, WelcomeNotificationStatus.Sent, startDate, startDate, null, startDate, null);
            var journey = EnsureJourney(hire, plan, JourneyStatus.Active, startDate, null);

            EnsureJourneyTask(journey, startDate, welcomeChecklist, welcomeModule, welcomeChecklist.Title, welcomeChecklist.Description, JourneyTaskStatus.Completed, null, startDate, enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, cultureGuide, welcomeModule, cultureGuide.Title, cultureGuide.Description, JourneyTaskStatus.Completed, startDate.AddDays(1), startDate.AddDays(1), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, kickoffCheckIn, integrationModule, kickoffCheckIn.Title, kickoffCheckIn.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(2), manager.Id, null);
            EnsureJourneyTask(journey, startDate, onboardingBuddy, integrationModule, onboardingBuddy.Title, onboardingBuddy.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(3), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, sandboxExercise, practiceModule, sandboxExercise.Title, sandboxExercise.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, reflection, practiceModule, reflection.Title, reflection.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, managerReview, capabilityModule, managerReview.Title, managerReview.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, capstoneRecap, capabilityModule, capstoneRecap.Title, capstoneRecap.Description, JourneyTaskStatus.Pending, null, null, null, null);

            EnsureHistoricalSnapshots(hire, journey, new[]
            {
                new SnapshotSeed(50m, 1, 0, 75m, EngagementClassification.Healthy, today.AddDays(-9).AddHours(9)),
                new SnapshotSeed(50m, 3, 0, 70.71m, EngagementClassification.NeedsAttention, today.AddDays(-6).AddHours(9)),
                new SnapshotSeed(50m, 5, 1, 59.29m, EngagementClassification.NeedsAttention, today.AddDays(-3).AddHours(9))
            });
        }

        private void SeedAtRiskHire(OnboardingPlan plan, User manager, User enrolee, OnboardingModule welcomeModule, OnboardingModule integrationModule, OnboardingModule practiceModule, OnboardingModule capabilityModule, OnboardingTask welcomeChecklist, OnboardingTask cultureGuide, OnboardingTask kickoffCheckIn, OnboardingTask onboardingBuddy, OnboardingTask sandboxExercise, OnboardingTask reflection, OnboardingTask managerReview, OnboardingTask capstoneRecap)
        {
            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(-14);
            var hire = EnsureHire(plan, enrolee, manager, "Thabo Ndlovu", enrolee.EmailAddress, "Implementation Analyst", "Delivery", startDate, HireLifecycleState.Active, WelcomeNotificationStatus.Sent, startDate, startDate, null, startDate, null);
            var journey = EnsureJourney(hire, plan, JourneyStatus.Active, startDate, null);

            EnsureJourneyTask(journey, startDate, welcomeChecklist, welcomeModule, welcomeChecklist.Title, welcomeChecklist.Description, JourneyTaskStatus.Completed, null, startDate.AddDays(2), enrolee.Id, null);
            EnsureJourneyTask(journey, startDate, cultureGuide, welcomeModule, cultureGuide.Title, cultureGuide.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, kickoffCheckIn, integrationModule, kickoffCheckIn.Title, kickoffCheckIn.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, onboardingBuddy, integrationModule, onboardingBuddy.Title, onboardingBuddy.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, sandboxExercise, practiceModule, sandboxExercise.Title, sandboxExercise.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, reflection, practiceModule, reflection.Title, reflection.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, managerReview, capabilityModule, managerReview.Title, managerReview.Description, JourneyTaskStatus.Pending, null, null, null, null);
            EnsureJourneyTask(journey, startDate, capstoneRecap, capabilityModule, capstoneRecap.Title, capstoneRecap.Description, JourneyTaskStatus.Pending, null, null, null, null);

            EnsureHistoricalSnapshots(hire, journey, new[]
            {
                new SnapshotSeed(37.5m, 4, 2, 48.93m, EngagementClassification.AtRisk, today.AddDays(-9).AddHours(11)),
                new SnapshotSeed(25m, 7, 4, 26.79m, EngagementClassification.AtRisk, today.AddDays(-5).AddHours(11)),
                new SnapshotSeed(12.5m, 11, 6, 12.68m, EngagementClassification.AtRisk, today.AddDays(-2).AddHours(11))
            });

            EnsureActiveFlag(hire, journey, today.AddDays(-2).AddHours(11));
        }
    }
}

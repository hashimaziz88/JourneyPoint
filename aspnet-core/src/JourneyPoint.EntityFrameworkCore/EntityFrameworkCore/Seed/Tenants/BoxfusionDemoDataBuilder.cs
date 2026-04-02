using System;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using JourneyPoint.Domains.Wellness.Enums;
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

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day1, WellnessCheckInStatus.Completed, startDate, startDate.AddHours(16),
                "Alex settled in quickly on day one, expressing enthusiasm about the team culture and workspace setup.",
                new[]
                {
                    new WellnessQuestionSeed(1, "How are you feeling about your first day so far?", "Really excited — the welcome checklist made everything feel organised and the team has been very welcoming.", null, true),
                    new WellnessQuestionSeed(2, "Is there anything you need to feel more comfortable in your new workspace?", "I have everything I need. The buddy system is a great touch.", null, true),
                    new WellnessQuestionSeed(3, "What are you most looking forward to in your onboarding journey?", "Getting stuck into the sandbox exercise and learning from real delivery scenarios.", null, true),
                });

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day2, WellnessCheckInStatus.Completed, startDate.AddDays(1), startDate.AddDays(1).AddHours(15),
                "Alex remains positive heading into day two, having completed the culture guide ahead of schedule.",
                new[]
                {
                    new WellnessQuestionSeed(1, "How did you sleep after your first day — any lingering concerns?", "Slept well! No concerns, just eager to get going on the culture material.", null, true),
                    new WellnessQuestionSeed(2, "Do you feel clear on what is expected of you this week?", "Yes, the manager kickoff really clarified the success measures for week one.", null, true),
                    new WellnessQuestionSeed(3, "Is there anything blocking your progress right now?", "Nothing at all — everything is on track.", null, true),
                });

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Week1, WellnessCheckInStatus.InProgress, startDate.AddDays(7), null, null,
                new[]
                {
                    new WellnessQuestionSeed(1, "Reflecting on your first full week, what has gone well?", "The sandbox exercise was challenging but I learned a lot from the facilitator feedback.", null, true),
                    new WellnessQuestionSeed(2, "Have you felt supported by your manager and team this week?", null, "Based on your onboarding progress, you could mention the manager kickoff and buddy sessions.", false),
                    new WellnessQuestionSeed(3, "What would help you most heading into week two?", null, null, false),
                });
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

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day1, WellnessCheckInStatus.Completed, startDate, startDate.AddHours(17),
                "Nomsa started positively but mentioned feeling slightly overwhelmed by the volume of reading material.",
                new[]
                {
                    new WellnessQuestionSeed(1, "How are you feeling about your first day so far?", "It was okay — lots to take in. The admin setup took longer than I expected.", null, true),
                    new WellnessQuestionSeed(2, "Is there anything you need to feel more comfortable in your new workspace?", "Maybe a quieter space for focused reading. The open plan is a bit distracting.", null, true),
                    new WellnessQuestionSeed(3, "What are you most looking forward to in your onboarding journey?", "Meeting the team properly and getting into the advisory work.", null, true),
                });

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day2, WellnessCheckInStatus.Pending, startDate.AddDays(1), null, null,
                new[]
                {
                    new WellnessQuestionSeed(1, "How did yesterday's reading go — were you able to complete the culture guide?", null, null, false),
                    new WellnessQuestionSeed(2, "Do you feel you have enough support from your manager and buddy?", null, null, false),
                    new WellnessQuestionSeed(3, "Is there anything you would change about how the first two days have been structured?", null, null, false),
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

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day1, WellnessCheckInStatus.Completed, startDate, startDate.AddDays(2).AddHours(10),
                "Thabo completed day-one wellness late on day three. Responses indicate uncertainty about role expectations and limited team connection.",
                new[]
                {
                    new WellnessQuestionSeed(1, "How are you feeling about your first day so far?", "Fine I guess. Still figuring out where everything is.", null, true),
                    new WellnessQuestionSeed(2, "Is there anything you need to feel more comfortable in your new workspace?", "Not sure yet. I haven't really met anyone besides the person who showed me around.", null, true),
                    new WellnessQuestionSeed(3, "What are you most looking forward to in your onboarding journey?", "Hopefully understanding what I'm actually supposed to be doing.", null, true),
                });

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Day2, WellnessCheckInStatus.Completed, startDate.AddDays(1), startDate.AddDays(5).AddHours(9),
                "Thabo responded four days late with minimally detailed answers, signalling disengagement. The hire mentions feeling unsure about support availability.",
                new[]
                {
                    new WellnessQuestionSeed(1, "How did you sleep after your first day — any lingering concerns?", "It was okay.", null, true),
                    new WellnessQuestionSeed(2, "Do you feel clear on what is expected of you this week?", "Not really. I have tasks listed but I'm not sure how to approach them.", null, true),
                    new WellnessQuestionSeed(3, "Is there anything blocking your progress right now?", "I don't know who to ask for help.", null, true),
                });

            EnsureWellnessCheckIn(hire, journey, WellnessCheckInPeriod.Week1, WellnessCheckInStatus.Pending, startDate.AddDays(7), null, null,
                new[]
                {
                    new WellnessQuestionSeed(1, "Reflecting on your first full week, what has gone well?", null, null, false),
                    new WellnessQuestionSeed(2, "Have you felt supported by your manager and team this week?", null, null, false),
                    new WellnessQuestionSeed(3, "What would help you most heading into week two?", null, null, false),
                });
        }
    }
}

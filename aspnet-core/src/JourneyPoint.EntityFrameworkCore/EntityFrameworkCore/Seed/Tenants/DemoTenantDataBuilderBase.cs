using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Authorization.Users;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.MultiTenancy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Provides idempotent helpers for tenant-scoped demo data builders.
    /// </summary>
    public abstract partial class DemoTenantDataBuilderBase
    {
        private readonly PasswordHasher<User> _passwordHasher =
            new(new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions()));

        /// <summary>
        /// Initializes the base seed builder for one tenant.
        /// </summary>
        protected DemoTenantDataBuilderBase(JourneyPointDbContext context, Tenant tenant)
        {
            Context = context;
            Tenant = tenant;
        }

        /// <summary>
        /// Gets the shared database context used for demo seeding.
        /// </summary>
        protected JourneyPointDbContext Context { get; }

        /// <summary>
        /// Gets the tenant currently being seeded.
        /// </summary>
        protected Tenant Tenant { get; }

        /// <summary>
        /// Creates the tenant-specific demo data set.
        /// </summary>
        public abstract void Create();

        protected User EnsureUser(string username, string emailAddress, string firstName, string lastName, params string[] roleNames)
        {
            var user = Context.Users
                .IgnoreQueryFilters()
                .SingleOrDefault(existingUser => existingUser.TenantId == Tenant.Id && existingUser.UserName == username);

            if (user == null)
            {
                user = new User
                {
                    TenantId = Tenant.Id,
                    UserName = username
                };

                Context.Users.Add(user);
            }

            user.Name = firstName;
            user.Surname = lastName;
            user.EmailAddress = emailAddress;
            user.IsEmailConfirmed = true;
            user.IsActive = true;
            user.SetNormalizedNames();
            user.Password = _passwordHasher.HashPassword(user, User.DefaultPassword);
            Context.SaveChanges();

            foreach (var roleName in roleNames.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                EnsureUserRole(user, roleName);
            }

            Context.SaveChanges();
            return user;
        }

        protected OnboardingPlan EnsurePublishedPlan(string name, string description, string targetAudience, int durationDays)
        {
            var plan = Context.OnboardingPlans
                .IgnoreQueryFilters()
                .SingleOrDefault(existingPlan => existingPlan.TenantId == Tenant.Id && existingPlan.Name == name);

            if (plan == null)
            {
                plan = new OnboardingPlan
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id
                };

                Context.OnboardingPlans.Add(plan);
            }

            plan.Name = name;
            plan.Description = description;
            plan.TargetAudience = targetAudience;
            plan.DurationDays = durationDays;
            plan.Status = OnboardingPlanStatus.Published;
            Context.SaveChanges();
            return plan;
        }

        protected OnboardingModule EnsureModule(OnboardingPlan plan, int orderIndex, string name, string description)
        {
            var module = Context.OnboardingModules
                .IgnoreQueryFilters()
                .SingleOrDefault(existingModule =>
                    existingModule.TenantId == Tenant.Id &&
                    existingModule.OnboardingPlanId == plan.Id &&
                    existingModule.OrderIndex == orderIndex);

            if (module == null)
            {
                module = new OnboardingModule
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    OnboardingPlanId = plan.Id
                };

                Context.OnboardingModules.Add(module);
            }

            module.Name = name;
            module.Description = description;
            module.OrderIndex = orderIndex;
            Context.SaveChanges();
            return module;
        }

        protected OnboardingTask EnsureTemplateTask(
            OnboardingModule module,
            int orderIndex,
            string title,
            string description,
            OnboardingTaskCategory category,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            var task = Context.OnboardingTasks
                .IgnoreQueryFilters()
                .SingleOrDefault(existingTask =>
                    existingTask.TenantId == Tenant.Id &&
                    existingTask.OnboardingModuleId == module.Id &&
                    existingTask.OrderIndex == orderIndex);

            if (task == null)
            {
                task = new OnboardingTask
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    OnboardingModuleId = module.Id
                };

                Context.OnboardingTasks.Add(task);
            }

            task.Title = title;
            task.Description = description;
            task.Category = category;
            task.OrderIndex = orderIndex;
            task.DueDayOffset = dueDayOffset;
            task.AssignmentTarget = assignmentTarget;
            task.AcknowledgementRule = acknowledgementRule;
            Context.SaveChanges();
            return task;
        }

        protected Hire EnsureHire(
            OnboardingPlan plan,
            User platformUser,
            User managerUser,
            string fullName,
            string emailAddress,
            string roleTitle,
            string department,
            DateTime startDate,
            HireLifecycleState status,
            WelcomeNotificationStatus welcomeStatus,
            DateTime? welcomeLastAttemptedAt,
            DateTime? welcomeSentAt,
            string welcomeFailureReason,
            DateTime? activatedAt,
            DateTime? completedAt)
        {
            var hire = Context.Hires
                .IgnoreQueryFilters()
                .SingleOrDefault(existingHire => existingHire.TenantId == Tenant.Id && existingHire.EmailAddress == emailAddress);

            if (hire == null)
            {
                hire = new Hire
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id
                };

                Context.Hires.Add(hire);
            }

            hire.OnboardingPlanId = plan.Id;
            hire.PlatformUserId = platformUser.Id;
            hire.ManagerUserId = managerUser?.Id;
            hire.FullName = fullName;
            hire.EmailAddress = emailAddress;
            hire.RoleTitle = roleTitle;
            hire.Department = department;
            hire.StartDate = startDate;
            hire.Status = status;
            hire.WelcomeNotificationStatus = welcomeStatus;
            hire.WelcomeNotificationLastAttemptedAt = welcomeLastAttemptedAt;
            hire.WelcomeNotificationSentAt = welcomeSentAt;
            hire.WelcomeNotificationFailureReason = welcomeFailureReason;
            hire.ActivatedAt = activatedAt;
            hire.CompletedAt = completedAt;
            hire.ExitedAt = status == HireLifecycleState.Exited ? completedAt : null;
            Context.SaveChanges();
            return hire;
        }

        protected Journey EnsureJourney(Hire hire, OnboardingPlan plan, JourneyStatus status, DateTime? activatedAt, DateTime? completedAt)
        {
            var journey = Context.Journeys
                .IgnoreQueryFilters()
                .SingleOrDefault(existingJourney => existingJourney.TenantId == Tenant.Id && existingJourney.HireId == hire.Id);

            if (journey == null)
            {
                journey = new Journey
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    HireId = hire.Id
                };

                Context.Journeys.Add(journey);
            }

            journey.OnboardingPlanId = plan.Id;
            journey.Status = status;
            journey.ActivatedAt = activatedAt;
            journey.PausedAt = null;
            journey.CompletedAt = completedAt;
            Context.SaveChanges();
            return journey;
        }

        protected JourneyTask EnsureJourneyTask(
            Journey journey,
            DateTime hireStartDate,
            OnboardingTask sourceTask,
            OnboardingModule sourceModule,
            string title,
            string description,
            JourneyTaskStatus status,
            DateTime? acknowledgedAt,
            DateTime? completedAt,
            long? completedByUserId,
            DateTime? personalisedAt)
        {
            var journeyTask = Context.JourneyTasks
                .IgnoreQueryFilters()
                .SingleOrDefault(existingTask =>
                    existingTask.TenantId == Tenant.Id &&
                    existingTask.JourneyId == journey.Id &&
                    existingTask.ModuleOrderIndex == sourceModule.OrderIndex &&
                    existingTask.TaskOrderIndex == sourceTask.OrderIndex);

            if (journeyTask == null)
            {
                journeyTask = new JourneyTask
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    JourneyId = journey.Id
                };

                Context.JourneyTasks.Add(journeyTask);
            }

            journeyTask.SourceOnboardingTaskId = sourceTask.Id;
            journeyTask.SourceOnboardingModuleId = sourceModule.Id;
            journeyTask.ModuleTitle = sourceModule.Name;
            journeyTask.ModuleOrderIndex = sourceModule.OrderIndex;
            journeyTask.TaskOrderIndex = sourceTask.OrderIndex;
            journeyTask.Title = title;
            journeyTask.Description = description;
            journeyTask.Category = sourceTask.Category;
            journeyTask.AssignmentTarget = sourceTask.AssignmentTarget;
            journeyTask.AcknowledgementRule = sourceTask.AcknowledgementRule;
            journeyTask.DueDayOffset = sourceTask.DueDayOffset;
            journeyTask.DueOn = hireStartDate.Date.AddDays(sourceTask.DueDayOffset);
            journeyTask.Status = status;
            journeyTask.AcknowledgedAt = acknowledgedAt;
            journeyTask.CompletedAt = completedAt;
            journeyTask.CompletedByUserId = completedByUserId;
            journeyTask.PersonalisedAt = personalisedAt;
            Context.SaveChanges();
            return journeyTask;
        }

        private void EnsureUserRole(User user, string roleName)
        {
            var role = Context.Roles
                .IgnoreQueryFilters()
                .Single(existingRole => existingRole.TenantId == Tenant.Id && existingRole.Name == roleName);

            var hasRole = Context.UserRoles
                .IgnoreQueryFilters()
                .Any(userRole =>
                    userRole.TenantId == Tenant.Id &&
                    userRole.UserId == user.Id &&
                    userRole.RoleId == role.Id);

            if (!hasRole)
            {
                Context.UserRoles.Add(new UserRole(Tenant.Id, user.Id, role.Id));
            }
        }
    }
}

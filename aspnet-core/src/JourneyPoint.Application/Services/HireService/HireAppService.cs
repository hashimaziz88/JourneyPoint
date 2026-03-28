using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using JourneyPoint.Application.Services.HireService.Dto;
using JourneyPoint.Application.Services.NotificationService;
using JourneyPoint.Authorization;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.HireService
{
    /// <summary>
    /// Provides tenant-scoped hire enrolment and account provisioning workflows.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public partial class HireAppService : JourneyPointAppServiceBase, IHireAppService
    {
        private readonly IRepository<Hire, System.Guid> _hireRepository;
        private readonly IRepository<OnboardingPlan, System.Guid> _onboardingPlanRepository;
        private readonly HireJourneyManager _hireJourneyManager;
        private readonly UserManager _userManager;
        private readonly IWelcomeNotificationService _welcomeNotificationService;

        /// <summary>
        /// Initializes the hire enrolment application service dependencies.
        /// </summary>
        public HireAppService(
            IRepository<Hire, System.Guid> hireRepository,
            IRepository<OnboardingPlan, System.Guid> onboardingPlanRepository,
            HireJourneyManager hireJourneyManager,
            UserManager userManager,
            IWelcomeNotificationService welcomeNotificationService)
        {
            _hireRepository = hireRepository;
            _onboardingPlanRepository = onboardingPlanRepository;
            _hireJourneyManager = hireJourneyManager;
            _userManager = userManager;
            _welcomeNotificationService = welcomeNotificationService;
        }

        /// <summary>
        /// Returns a filtered page of tenant-scoped hires for facilitator management views.
        /// </summary>
        public async Task<PagedResultDto<HireListItemDto>> GetHiresAsync(GetHiresInput input)
        {
            return await GetHiresPageAsync(input);
        }

        /// <summary>
        /// Returns one hire with journey summary and notification metadata.
        /// </summary>
        public async Task<HireDetailDto> GetDetailAsync(EntityDto<Guid> input)
        {
            ArgumentNullException.ThrowIfNull(input);
            return await GetHireDetailAsync(input.Id);
        }

        /// <summary>
        /// Returns same-tenant active managers that facilitators can associate to a hire.
        /// </summary>
        public async Task<ListResultDto<ManagerOptionDto>> GetManagerOptionsAsync()
        {
            return await GetManagerOptionsListAsync();
        }

        /// <summary>
        /// Creates the hire record, platform account, and welcome-notification attempt.
        /// </summary>
        public async Task<HireEnrolmentResultDto> CreateAsync(CreateHireRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var tenantId = GetRequiredTenantId();
            var onboardingPlan = await GetPublishedPlanAsync(input.OnboardingPlanId, tenantId);
            var managerUser = await GetManagerUserOrNullAsync(input.ManagerUserId, tenantId);
            var normalizedEmailAddress = NormalizeEmailAddress(input.EmailAddress);

            await EnsureHireEmailIsAvailableAsync(normalizedEmailAddress, tenantId);
            await EnsurePlatformEmailIsAvailableAsync(normalizedEmailAddress, tenantId);

            var hire = _hireJourneyManager.CreateHire(
                tenantId,
                onboardingPlan,
                input.FullName,
                normalizedEmailAddress,
                input.RoleTitle,
                input.Department,
                input.StartDate,
                managerUser?.Id);

            var temporaryPassword = "123qwe"; //
            var platformUser = BuildPlatformUser(hire, normalizedEmailAddress);

            await _userManager.InitializeOptionsAsync(tenantId);
            CheckErrors(await _userManager.CreateAsync(platformUser, temporaryPassword));
            CheckErrors(await _userManager.AddToRoleAsync(platformUser, Authorization.Roles.StaticRoleNames.Tenants.Enrolee));

            _hireJourneyManager.AssignPlatformUser(hire, platformUser.Id);
            await _hireRepository.InsertAsync(hire);
            await CurrentUnitOfWork.SaveChangesAsync();

            var welcomeResult = await SendWelcomeNotificationAsync(hire, platformUser, temporaryPassword);
            ApplyWelcomeResult(hire, welcomeResult);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToResultDto(hire);
        }
    }
}

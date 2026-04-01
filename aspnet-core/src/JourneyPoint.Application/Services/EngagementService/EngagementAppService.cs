using System;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using JourneyPoint.Application.Services.EngagementService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Helpers;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.EngagementService
{
    /// <summary>
    /// Provides tenant-safe pipeline, hire intelligence, and intervention application workflows.
    /// </summary>
    public partial class EngagementAppService : JourneyPointAppServiceBase, IEngagementAppService
    {
        private readonly IRepository<Hire, Guid> _hireRepository;
        private readonly IRepository<JourneyTask, Guid> _journeyTaskRepository;
        private readonly IRepository<EngagementSnapshot, Guid> _engagementSnapshotRepository;
        private readonly IRepository<AtRiskFlag, Guid> _atRiskFlagRepository;
        private readonly EngagementManager _engagementManager;
        private readonly EngagementScoreCalculator _engagementScoreService;
        private readonly UserManager _userManager;

        /// <summary>
        /// Initializes the engagement application service dependencies.
        /// </summary>
        public EngagementAppService(
            IRepository<Hire, Guid> hireRepository,
            IRepository<JourneyTask, Guid> journeyTaskRepository,
            IRepository<EngagementSnapshot, Guid> engagementSnapshotRepository,
            IRepository<AtRiskFlag, Guid> atRiskFlagRepository,
            EngagementManager engagementManager,
            EngagementScoreCalculator engagementScoreService,
            UserManager userManager)
        {
            _hireRepository = hireRepository;
            _journeyTaskRepository = journeyTaskRepository;
            _engagementSnapshotRepository = engagementSnapshotRepository;
            _atRiskFlagRepository = atRiskFlagRepository;
            _engagementManager = engagementManager;
            _engagementScoreService = engagementScoreService;
            _userManager = userManager;
        }

        /// <summary>
        /// Returns the facilitator pipeline board with current engagement intelligence.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
        public async Task<PipelineBoardDto> GetPipelineBoardAsync(GetPipelineBoardInput input)
        {
            var pipelineResult = await BuildPipelineBoardAsync(GetRequiredTenantId(), input);
            await CurrentUnitOfWork.SaveChangesAsync();
            return pipelineResult;
        }

        /// <summary>
        /// Returns one hire intelligence profile with current score, history, and flags.
        /// </summary>
        [AbpAuthorize(
            PermissionNames.Pages_JourneyPoint_Facilitator,
            PermissionNames.Pages_JourneyPoint_TenantAdmin,
            PermissionNames.Pages_JourneyPoint_Manager)]
        public async Task<HireIntelligenceDetailDto> GetHireIntelligenceAsync(Guid hireId)
        {
            var currentUser = await GetCurrentUserAsync();
            var hire = await GetHireForIntelligenceAsync(hireId, GetRequiredTenantId(), currentUser);
            var detail = await BuildHireIntelligenceAsync(hire, currentUser);
            await CurrentUnitOfWork.SaveChangesAsync();
            return detail;
        }

        /// <summary>
        /// Records facilitator acknowledgement of an active at-risk flag.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
        public async Task<AtRiskFlagDto> AcknowledgeAtRiskFlagAsync(AcknowledgeAtRiskFlagRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var flag = await GetFlagForFacilitatorActionAsync(input.FlagId, GetRequiredTenantId());
            _engagementManager.AcknowledgeFlag(flag, GetRequiredUserId(), input.AcknowledgementNotes);
            await CurrentUnitOfWork.SaveChangesAsync();

            var userDisplayNames = await GetUserDisplayNamesAsync(flag.TenantId, flag.AcknowledgedByUserId, flag.ResolvedByUserId);
            return MapToFlagDto(flag, userDisplayNames);
        }

        /// <summary>
        /// Records facilitator resolution of an unresolved at-risk flag.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
        public async Task<AtRiskFlagDto> ResolveAtRiskFlagAsync(ResolveAtRiskFlagRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var flag = await GetFlagForFacilitatorActionAsync(input.FlagId, GetRequiredTenantId());
            _engagementManager.ResolveFlag(flag, GetRequiredUserId(), input.ResolutionType, input.ResolutionNotes);
            await CurrentUnitOfWork.SaveChangesAsync();

            var userDisplayNames = await GetUserDisplayNamesAsync(flag.TenantId, flag.AcknowledgedByUserId, flag.ResolvedByUserId);
            return MapToFlagDto(flag, userDisplayNames);
        }
    }
}

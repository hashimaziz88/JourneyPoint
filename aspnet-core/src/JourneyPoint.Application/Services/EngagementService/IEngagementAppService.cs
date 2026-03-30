using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Application.Services.EngagementService.Dto;

namespace JourneyPoint.Application.Services.EngagementService
{
    /// <summary>
    /// Defines facilitator and manager analytics workflows for engagement intelligence.
    /// </summary>
    public interface IEngagementAppService : IApplicationService
    {
        /// <summary>
        /// Returns the facilitator pipeline board with current engagement intelligence.
        /// </summary>
        Task<PipelineBoardDto> GetPipelineBoardAsync(GetPipelineBoardInput input);

        /// <summary>
        /// Returns one hire intelligence profile with current score, history, and flags.
        /// </summary>
        Task<HireIntelligenceDetailDto> GetHireIntelligenceAsync(Guid hireId);

        /// <summary>
        /// Records facilitator acknowledgement of an active at-risk flag.
        /// </summary>
        Task<AtRiskFlagDto> AcknowledgeAtRiskFlagAsync(AcknowledgeAtRiskFlagRequest input);

        /// <summary>
        /// Records facilitator resolution of an unresolved at-risk flag.
        /// </summary>
        Task<AtRiskFlagDto> ResolveAtRiskFlagAsync(ResolveAtRiskFlagRequest input);
    }
}

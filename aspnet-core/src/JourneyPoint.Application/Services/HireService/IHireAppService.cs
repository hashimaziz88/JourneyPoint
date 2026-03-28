using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JourneyPoint.Application.Services.HireService.Dto;

namespace JourneyPoint.Application.Services.HireService
{
    /// <summary>
    /// Defines tenant-scoped hire enrolment workflows.
    /// </summary>
    public interface IHireAppService : IApplicationService
    {
        /// <summary>
        /// Returns a filtered page of tenant-scoped hires for facilitator management views.
        /// </summary>
        Task<PagedResultDto<HireListItemDto>> GetHiresAsync(GetHiresInput input);

        /// <summary>
        /// Returns one hire with journey summary and notification metadata.
        /// </summary>
        Task<HireDetailDto> GetDetailAsync(EntityDto<Guid> input);

        /// <summary>
        /// Returns the tenant-scoped manager options available for hire association.
        /// </summary>
        Task<ListResultDto<ManagerOptionDto>> GetManagerOptionsAsync();

        /// <summary>
        /// Creates the hire record, platform account, and welcome-notification attempt.
        /// </summary>
        Task<HireEnrolmentResultDto> CreateAsync(CreateHireRequest input);

        /// <summary>
        /// Reissues credentials and retries the welcome notification for one pending hire.
        /// </summary>
        Task<HireEnrolmentResultDto> ResendWelcomeNotificationAsync(EntityDto<Guid> input);
    }
}

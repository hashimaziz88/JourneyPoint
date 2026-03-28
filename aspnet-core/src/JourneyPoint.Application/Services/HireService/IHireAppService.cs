using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Application.Services.HireService.Dto;

namespace JourneyPoint.Application.Services.HireService
{
    /// <summary>
    /// Defines tenant-scoped hire enrolment workflows.
    /// </summary>
    public interface IHireAppService : IApplicationService
    {
        /// <summary>
        /// Creates the hire record, platform account, and welcome-notification attempt.
        /// </summary>
        Task<HireEnrolmentResultDto> CreateAsync(CreateHireRequest input);
    }
}

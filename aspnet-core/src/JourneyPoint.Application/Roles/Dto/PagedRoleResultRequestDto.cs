using Abp.Application.Services.Dto;

namespace JourneyPoint.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}


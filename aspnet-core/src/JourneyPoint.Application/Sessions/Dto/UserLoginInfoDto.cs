using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using JourneyPoint.Authorization.Users;

namespace JourneyPoint.Sessions.Dto
{
    [AutoMapFrom(typeof(User))]
    /// <summary>
    /// Describes the current authenticated user returned in the session payload.
    /// </summary>
    public class UserLoginInfoDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public IReadOnlyList<string> RoleNames { get; set; }

        public string PrimaryRoleName { get; set; }
    }
}

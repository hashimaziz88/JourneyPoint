using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JourneyPoint.Roles.Dto;
using JourneyPoint.Users.Dto;

namespace JourneyPoint.Users
{
    /// <summary>
    /// Defines application service operations for tenant-scoped user management.
    /// </summary>
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        /// <summary>
        /// Deactivates the specified user.
        /// </summary>
        Task DeActivate(EntityDto<long> user);

        /// <summary>
        /// Activates the specified user.
        /// </summary>
        Task Activate(EntityDto<long> user);

        /// <summary>
        /// Returns the roles available to the current tenant scope.
        /// </summary>
        Task<ListResultDto<RoleDto>> GetRoles();

        /// <summary>
        /// Changes the current user's preferred language.
        /// </summary>
        Task ChangeLanguage(ChangeUserLanguageDto input);

        /// <summary>
        /// Changes the current user's password after validating their current password.
        /// </summary>
        Task<bool> ChangePassword(ChangePasswordDto input);
    }
}

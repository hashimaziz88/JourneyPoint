using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using JourneyPoint.Authorization;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Editions;
using JourneyPoint.MultiTenancy.Dto;
using Microsoft.AspNetCore.Identity;

namespace JourneyPoint.MultiTenancy
{
    [AbpAuthorize(PermissionNames.Pages_Tenants)]
    /// <summary>
    /// Provides host-level tenant management workflows and tenant bootstrap behavior.
    /// </summary>
    public class TenantAppService : AsyncCrudAppService<Tenant, TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>, ITenantAppService
    {
        private readonly TenantManager _tenantManager;
        private readonly EditionManager _editionManager;
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IAbpZeroDbMigrator _abpZeroDbMigrator;

        public TenantAppService(
            IRepository<Tenant, int> repository,
            TenantManager tenantManager,
            EditionManager editionManager,
            UserManager userManager,
            RoleManager roleManager,
            IAbpZeroDbMigrator abpZeroDbMigrator)
            : base(repository)
        {
            _tenantManager = tenantManager;
            _editionManager = editionManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _abpZeroDbMigrator = abpZeroDbMigrator;
        }

        /// <summary>
        /// Creates a tenant, provisions its database, seeds its static roles, and creates the tenant admin user.
        /// </summary>
        public override async Task<TenantDto> CreateAsync(CreateTenantDto input)
        {
            CheckCreatePermission();

            // Create tenant
            var tenant = ObjectMapper.Map<Tenant>(input);
            tenant.ConnectionString = input.ConnectionString.IsNullOrEmpty()
                ? null
                : SimpleStringCipher.Instance.Encrypt(input.ConnectionString);

            var defaultEdition = await _editionManager.FindByNameAsync(EditionManager.DefaultEditionName);
            if (defaultEdition != null)
            {
                tenant.EditionId = defaultEdition.Id;
            }

            await _tenantManager.CreateAsync(tenant);
            await CurrentUnitOfWork.SaveChangesAsync(); // To get new tenant's id.

            // Create tenant database
            _abpZeroDbMigrator.CreateOrMigrateForTenant(tenant);

            // We are working entities of new tenant, so changing tenant filter
            using (CurrentUnitOfWork.SetTenantId(tenant.Id))
            {
                // Create static roles for new tenant
                CheckErrors(await _roleManager.CreateStaticRoles(tenant.Id));
                await CurrentUnitOfWork.SaveChangesAsync(); // To get static role ids
                await ApplyJourneyPointTenantRoleDefaultsAsync(tenant.Id);
                await CurrentUnitOfWork.SaveChangesAsync();

                var adminRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);

                // Create admin user for the tenant
                var adminUser = User.CreateTenantAdminUser(tenant.Id, input.AdminEmailAddress);
                await _userManager.InitializeOptionsAsync(tenant.Id);
                CheckErrors(await _userManager.CreateAsync(adminUser, User.DefaultPassword));
                await CurrentUnitOfWork.SaveChangesAsync(); // To get admin user's id

                // Assign admin user to role!
                CheckErrors(await _userManager.AddToRoleAsync(adminUser, adminRole.Name));
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return MapToEntityDto(tenant);
        }

        protected override IQueryable<Tenant> CreateFilteredQuery(PagedTenantResultRequestDto input)
        {
            return Repository.GetAll()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.TenancyName.Contains(input.Keyword) || x.Name.Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive);
        }

        protected override void MapToEntity(TenantDto updateInput, Tenant entity)
        {
            // Manually mapped since TenantDto contains non-editable properties too.
            entity.Name = updateInput.Name;
            entity.TenancyName = updateInput.TenancyName;
            entity.IsActive = updateInput.IsActive;
        }

        /// <summary>
        /// Deletes the requested tenant through the tenant manager.
        /// </summary>
        public override async Task DeleteAsync(EntityDto<int> input)
        {
            CheckDeletePermission();

            var tenant = await _tenantManager.GetByIdAsync(input.Id);
            await _tenantManager.DeleteAsync(tenant);
        }

        private void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        private async Task ApplyJourneyPointTenantRoleDefaultsAsync(int tenantId)
        {
            var roleNames = StaticRoleNames.Tenants.GetStaticRoleNames();
            var tenantRoles = _roleManager.Roles
                .Where(r => r.TenantId == tenantId && roleNames.Contains(r.Name))
                .ToList();
            var permissionsByName = PermissionFinder.GetAllPermissions(new JourneyPointAuthorizationProvider())
                .ToDictionary(permission => permission.Name);

            foreach (var role in tenantRoles)
            {
                var expectedDisplayName = StaticRoleNames.Tenants.GetDisplayName(role.Name);
                if (role.DisplayName != expectedDisplayName)
                {
                    role.DisplayName = expectedDisplayName;
                    CheckErrors(await _roleManager.UpdateAsync(role));
                }
            }

            var adminRole = tenantRoles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);
            await _roleManager.GrantAllPermissionsAsync(adminRole);

            foreach (var role in tenantRoles.Where(r => r.Name != StaticRoleNames.Tenants.Admin))
            {
                foreach (var permissionName in JourneyPointTenantRolePermissionDefaults.GetDefaultGrantedPermissions(role.Name))
                {
                    await _roleManager.GrantPermissionAsync(role, permissionsByName[permissionName]);
                }
            }
        }
    }
}

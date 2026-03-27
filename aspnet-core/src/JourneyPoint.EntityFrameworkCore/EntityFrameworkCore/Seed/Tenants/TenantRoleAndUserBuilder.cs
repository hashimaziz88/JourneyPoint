using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using JourneyPoint.Authorization;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    public class TenantRoleAndUserBuilder
    {
        private readonly JourneyPointDbContext _context;
        private readonly int _tenantId;

        public TenantRoleAndUserBuilder(JourneyPointDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            CreateRolesAndUsers();
        }

        private void CreateRolesAndUsers()
        {
            var tenantRoles = EnsureTenantRoles();
            var adminRole = tenantRoles[StaticRoleNames.Tenants.Admin];

            // Grant all tenant permissions to the seeded tenant admin role.
            var grantedPermissions = _context.Permissions.IgnoreQueryFilters()
                .OfType<RolePermissionSetting>()
                .Where(p => p.TenantId == _tenantId && p.RoleId == adminRole.Id)
                .Select(p => p.Name)
                .ToList();

            var permissions = PermissionFinder
                .GetAllPermissions(new JourneyPointAuthorizationProvider())
                .Where(p => p.MultiTenancySides.HasFlag(MultiTenancySides.Tenant)
                    && !grantedPermissions.Contains(p.Name))
                .ToList();

            if (permissions.Any())
            {
                _context.Permissions.AddRange(
                    permissions.Select(permission => new RolePermissionSetting
                    {
                        TenantId = _tenantId,
                        Name = permission.Name,
                        IsGranted = true,
                        RoleId = adminRole.Id
                    })
                );
                _context.SaveChanges();
            }

            foreach (var role in tenantRoles.Values.Where(role => role.Name != StaticRoleNames.Tenants.Admin))
            {
                GrantMissingPermissions(role, JourneyPointTenantRolePermissionDefaults.GetDefaultGrantedPermissions(role.Name));
            }

            var adminUser = _context.Users.IgnoreQueryFilters()
                .FirstOrDefault(u => u.TenantId == _tenantId && u.UserName == AbpUserBase.AdminUserName);
            if (adminUser == null)
            {
                adminUser = User.CreateTenantAdminUser(_tenantId, "admin@defaulttenant.com");
                adminUser.Password = new PasswordHasher<User>(
                    new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions())
                ).HashPassword(adminUser, "123qwe");
                adminUser.IsEmailConfirmed = true;
                adminUser.IsActive = true;

                _context.Users.Add(adminUser);
                _context.SaveChanges();

                _context.UserRoles.Add(new UserRole(_tenantId, adminUser.Id, adminRole.Id));
                _context.SaveChanges();
            }
        }

        private Dictionary<string, Role> EnsureTenantRoles()
        {
            var tenantRoles = new Dictionary<string, Role>();

            foreach (var roleName in StaticRoleNames.Tenants.GetStaticRoleNames())
            {
                var role = _context.Roles.IgnoreQueryFilters()
                    .FirstOrDefault(r => r.TenantId == _tenantId && r.Name == roleName);
                var displayName = StaticRoleNames.Tenants.GetDisplayName(roleName);

                if (role == null)
                {
                    role = _context.Roles.Add(
                        new Role(_tenantId, roleName, displayName)
                        {
                            IsStatic = true
                        }
                    ).Entity;
                }
                else
                {
                    role.IsStatic = true;
                    role.DisplayName = displayName;
                }

                tenantRoles[roleName] = role;
            }

            _context.SaveChanges();

            return tenantRoles;
        }

        private void GrantMissingPermissions(Role role, IReadOnlyList<string> permissionNames)
        {
            if (permissionNames.Count == 0)
            {
                return;
            }

            var grantedPermissions = _context.Permissions.IgnoreQueryFilters()
                .OfType<RolePermissionSetting>()
                .Where(p => p.TenantId == _tenantId && p.RoleId == role.Id)
                .Select(p => p.Name)
                .ToList();

            var missingPermissions = permissionNames
                .Where(permissionName => !grantedPermissions.Contains(permissionName))
                .Select(permissionName => new RolePermissionSetting
                {
                    TenantId = _tenantId,
                    Name = permissionName,
                    IsGranted = true,
                    RoleId = role.Id
                })
                .ToList();

            if (!missingPermissions.Any())
            {
                return;
            }

            _context.Permissions.AddRange(missingPermissions);
            _context.SaveChanges();
        }
    }
}

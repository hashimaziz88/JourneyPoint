using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.MultiTenancy;

namespace JourneyPoint.EntityFrameworkCore
{
    public class JourneyPointDbContext : AbpZeroDbContext<Tenant, Role, User, JourneyPointDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public JourneyPointDbContext(DbContextOptions<JourneyPointDbContext> options)
            : base(options)
        {
        }
    }
}

using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.EntityFrameworkCore
{
    public static class JourneyPointDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<JourneyPointDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<JourneyPointDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}

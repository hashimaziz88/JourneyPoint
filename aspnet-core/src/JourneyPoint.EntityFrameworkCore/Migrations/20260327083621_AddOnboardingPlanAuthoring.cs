using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddOnboardingPlanAuthoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OnboardingPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    TargetAudience = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DurationDays = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnboardingPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OnboardingModules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    OnboardingPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnboardingModules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnboardingModules_OnboardingPlans_OnboardingPlanId",
                        column: x => x.OnboardingPlanId,
                        principalTable: "OnboardingPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OnboardingTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    OnboardingModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    DueDayOffset = table.Column<int>(type: "integer", nullable: false),
                    AssignmentTarget = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgementRule = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnboardingTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnboardingTasks_OnboardingModules_OnboardingModuleId",
                        column: x => x.OnboardingModuleId,
                        principalTable: "OnboardingModules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingModules_OnboardingPlanId",
                table: "OnboardingModules",
                column: "OnboardingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingModules_OnboardingPlanId_OrderIndex",
                table: "OnboardingModules",
                columns: new[] { "OnboardingPlanId", "OrderIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingModules_TenantId",
                table: "OnboardingModules",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingPlans_TenantId",
                table: "OnboardingPlans",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingPlans_TenantId_Status",
                table: "OnboardingPlans",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingTasks_OnboardingModuleId",
                table: "OnboardingTasks",
                column: "OnboardingModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingTasks_OnboardingModuleId_OrderIndex",
                table: "OnboardingTasks",
                columns: new[] { "OnboardingModuleId", "OrderIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingTasks_TenantId",
                table: "OnboardingTasks",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OnboardingTasks");

            migrationBuilder.DropTable(
                name: "OnboardingModules");

            migrationBuilder.DropTable(
                name: "OnboardingPlans");
        }
    }
}

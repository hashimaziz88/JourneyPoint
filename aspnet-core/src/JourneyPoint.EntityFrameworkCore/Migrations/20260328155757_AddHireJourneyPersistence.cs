using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddHireJourneyPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hires",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    OnboardingPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlatformUserId = table.Column<long>(type: "bigint", nullable: true),
                    ManagerUserId = table.Column<long>(type: "bigint", nullable: true),
                    FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    RoleTitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Department = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ActivatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExitedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_Hires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hires_OnboardingPlans_OnboardingPlanId",
                        column: x => x.OnboardingPlanId,
                        principalTable: "OnboardingPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Journeys",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    HireId = table.Column<Guid>(type: "uuid", nullable: false),
                    OnboardingPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ActivatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PausedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_Journeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Journeys_Hires_HireId",
                        column: x => x.HireId,
                        principalTable: "Hires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Journeys_OnboardingPlans_OnboardingPlanId",
                        column: x => x.OnboardingPlanId,
                        principalTable: "OnboardingPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JourneyTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    JourneyId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceOnboardingTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    SourceOnboardingModuleId = table.Column<Guid>(type: "uuid", nullable: true),
                    ModuleTitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ModuleOrderIndex = table.Column<int>(type: "integer", nullable: false),
                    TaskOrderIndex = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    AssignmentTarget = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgementRule = table.Column<int>(type: "integer", nullable: false),
                    DueDayOffset = table.Column<int>(type: "integer", nullable: false),
                    DueOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedByUserId = table.Column<long>(type: "bigint", nullable: true),
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
                    table.PrimaryKey("PK_JourneyTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JourneyTasks_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JourneyTasks_OnboardingModules_SourceOnboardingModuleId",
                        column: x => x.SourceOnboardingModuleId,
                        principalTable: "OnboardingModules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JourneyTasks_OnboardingTasks_SourceOnboardingTaskId",
                        column: x => x.SourceOnboardingTaskId,
                        principalTable: "OnboardingTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Hires_ManagerUserId",
                table: "Hires",
                column: "ManagerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Hires_OnboardingPlanId",
                table: "Hires",
                column: "OnboardingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Hires_PlatformUserId",
                table: "Hires",
                column: "PlatformUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Hires_TenantId",
                table: "Hires",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Hires_TenantId_EmailAddress",
                table: "Hires",
                columns: new[] { "TenantId", "EmailAddress" });

            migrationBuilder.CreateIndex(
                name: "IX_Hires_TenantId_Status",
                table: "Hires",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Journeys_HireId",
                table: "Journeys",
                column: "HireId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Journeys_OnboardingPlanId",
                table: "Journeys",
                column: "OnboardingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Journeys_TenantId",
                table: "Journeys",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Journeys_TenantId_Status",
                table: "Journeys",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_JourneyId",
                table: "JourneyTasks",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_JourneyId_AssignmentTarget",
                table: "JourneyTasks",
                columns: new[] { "JourneyId", "AssignmentTarget" });

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_JourneyId_ModuleOrderIndex_TaskOrderIndex",
                table: "JourneyTasks",
                columns: new[] { "JourneyId", "ModuleOrderIndex", "TaskOrderIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_JourneyId_Status",
                table: "JourneyTasks",
                columns: new[] { "JourneyId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_SourceOnboardingModuleId",
                table: "JourneyTasks",
                column: "SourceOnboardingModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_SourceOnboardingTaskId",
                table: "JourneyTasks",
                column: "SourceOnboardingTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_JourneyTasks_TenantId",
                table: "JourneyTasks",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JourneyTasks");

            migrationBuilder.DropTable(
                name: "Journeys");

            migrationBuilder.DropTable(
                name: "Hires");
        }
    }
}

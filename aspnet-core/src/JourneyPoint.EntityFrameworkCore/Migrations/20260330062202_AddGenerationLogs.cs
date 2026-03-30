using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddGenerationLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GenerationLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    WorkflowType = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    HireId = table.Column<Guid>(type: "uuid", nullable: true),
                    JourneyId = table.Column<Guid>(type: "uuid", nullable: true),
                    OnboardingPlanId = table.Column<Guid>(type: "uuid", nullable: true),
                    OnboardingDocumentId = table.Column<Guid>(type: "uuid", nullable: true),
                    ModelName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PromptSummary = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ResponseSummary = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    FailureReason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TasksAdded = table.Column<int>(type: "integer", nullable: false),
                    TasksRevised = table.Column<int>(type: "integer", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DurationMilliseconds = table.Column<long>(type: "bigint", nullable: false),
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
                    table.PrimaryKey("PK_GenerationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GenerationLogs_Hires_HireId",
                        column: x => x.HireId,
                        principalTable: "Hires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GenerationLogs_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GenerationLogs_OnboardingDocuments_OnboardingDocumentId",
                        column: x => x.OnboardingDocumentId,
                        principalTable: "OnboardingDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GenerationLogs_OnboardingPlans_OnboardingPlanId",
                        column: x => x.OnboardingPlanId,
                        principalTable: "OnboardingPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_CompletedAt",
                table: "GenerationLogs",
                column: "CompletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_HireId",
                table: "GenerationLogs",
                column: "HireId");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_JourneyId",
                table: "GenerationLogs",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_OnboardingDocumentId",
                table: "GenerationLogs",
                column: "OnboardingDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_OnboardingPlanId",
                table: "GenerationLogs",
                column: "OnboardingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_TenantId",
                table: "GenerationLogs",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_TenantId_Status",
                table: "GenerationLogs",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_GenerationLogs_TenantId_WorkflowType",
                table: "GenerationLogs",
                columns: new[] { "TenantId", "WorkflowType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GenerationLogs");
        }
    }
}

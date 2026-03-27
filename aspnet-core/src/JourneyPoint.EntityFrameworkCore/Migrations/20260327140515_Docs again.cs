using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class Docsagain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OnboardingDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    OnboardingPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    StoragePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ExtractedTaskCount = table.Column<int>(type: "integer", nullable: false),
                    AcceptedTaskCount = table.Column<int>(type: "integer", nullable: false),
                    FailureReason = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ExtractionCompletedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_OnboardingDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnboardingDocuments_OnboardingPlans_OnboardingPlanId",
                        column: x => x.OnboardingPlanId,
                        principalTable: "OnboardingPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExtractedTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    OnboardingDocumentId = table.Column<Guid>(type: "uuid", nullable: false),
                    SuggestedModuleId = table.Column<Guid>(type: "uuid", nullable: true),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    DueDayOffset = table.Column<int>(type: "integer", nullable: false),
                    AssignmentTarget = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgementRule = table.Column<int>(type: "integer", nullable: false),
                    ReviewStatus = table.Column<int>(type: "integer", nullable: false),
                    ReviewedByUserId = table.Column<long>(type: "bigint", nullable: true),
                    ReviewedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AppliedOnboardingTaskId = table.Column<Guid>(type: "uuid", nullable: true),
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
                    table.PrimaryKey("PK_ExtractedTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExtractedTasks_OnboardingDocuments_OnboardingDocumentId",
                        column: x => x.OnboardingDocumentId,
                        principalTable: "OnboardingDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedTasks_OnboardingDocumentId",
                table: "ExtractedTasks",
                column: "OnboardingDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedTasks_OnboardingDocumentId_ReviewStatus",
                table: "ExtractedTasks",
                columns: new[] { "OnboardingDocumentId", "ReviewStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedTasks_SuggestedModuleId",
                table: "ExtractedTasks",
                column: "SuggestedModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedTasks_TenantId",
                table: "ExtractedTasks",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingDocuments_OnboardingPlanId",
                table: "OnboardingDocuments",
                column: "OnboardingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingDocuments_OnboardingPlanId_Status",
                table: "OnboardingDocuments",
                columns: new[] { "OnboardingPlanId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_OnboardingDocuments_TenantId",
                table: "OnboardingDocuments",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExtractedTasks");

            migrationBuilder.DropTable(
                name: "OnboardingDocuments");
        }
    }
}

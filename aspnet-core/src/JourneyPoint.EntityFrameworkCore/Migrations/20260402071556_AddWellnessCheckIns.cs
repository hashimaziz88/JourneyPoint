using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddWellnessCheckIns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WellnessCheckIns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    HireId = table.Column<Guid>(type: "uuid", nullable: false),
                    JourneyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Period = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ScheduledDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InsightSummary = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
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
                    table.PrimaryKey("PK_WellnessCheckIns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WellnessCheckIns_Hires_HireId",
                        column: x => x.HireId,
                        principalTable: "Hires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WellnessCheckIns_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WellnessQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    WellnessCheckInId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    QuestionText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    AnswerText = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: true),
                    AiSuggestedAnswer = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: true),
                    IsAnswered = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_WellnessQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WellnessQuestions_WellnessCheckIns_WellnessCheckInId",
                        column: x => x.WellnessCheckInId,
                        principalTable: "WellnessCheckIns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WellnessCheckIns_HireId",
                table: "WellnessCheckIns",
                column: "HireId");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessCheckIns_HireId_Period",
                table: "WellnessCheckIns",
                columns: new[] { "HireId", "Period" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WellnessCheckIns_JourneyId",
                table: "WellnessCheckIns",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessCheckIns_TenantId",
                table: "WellnessCheckIns",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessCheckIns_TenantId_Status",
                table: "WellnessCheckIns",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_WellnessQuestions_TenantId",
                table: "WellnessQuestions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessQuestions_WellnessCheckInId",
                table: "WellnessQuestions",
                column: "WellnessCheckInId");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessQuestions_WellnessCheckInId_OrderIndex",
                table: "WellnessQuestions",
                columns: new[] { "WellnessCheckInId", "OrderIndex" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WellnessQuestions");

            migrationBuilder.DropTable(
                name: "WellnessCheckIns");
        }
    }
}

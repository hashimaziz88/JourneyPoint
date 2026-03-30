using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddEngagementPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AtRiskFlags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    HireId = table.Column<Guid>(type: "uuid", nullable: false),
                    JourneyId = table.Column<Guid>(type: "uuid", nullable: false),
                    RaisedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClassificationAtRaise = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgedByUserId = table.Column<long>(type: "bigint", nullable: true),
                    AcknowledgedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AcknowledgementNotes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ResolvedByUserId = table.Column<long>(type: "bigint", nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResolutionType = table.Column<int>(type: "integer", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
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
                    table.PrimaryKey("PK_AtRiskFlags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AtRiskFlags_Hires_HireId",
                        column: x => x.HireId,
                        principalTable: "Hires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AtRiskFlags_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngagementSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    HireId = table.Column<Guid>(type: "uuid", nullable: false),
                    JourneyId = table.Column<Guid>(type: "uuid", nullable: false),
                    CompletionRate = table.Column<decimal>(type: "numeric", nullable: false),
                    DaysSinceLastActivity = table.Column<int>(type: "integer", nullable: false),
                    OverdueTaskCount = table.Column<int>(type: "integer", nullable: false),
                    CompositeScore = table.Column<decimal>(type: "numeric", nullable: false),
                    Classification = table.Column<int>(type: "integer", nullable: false),
                    ComputedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                    table.PrimaryKey("PK_EngagementSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngagementSnapshots_Hires_HireId",
                        column: x => x.HireId,
                        principalTable: "Hires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EngagementSnapshots_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_HireId",
                table: "AtRiskFlags",
                column: "HireId");

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_JourneyId",
                table: "AtRiskFlags",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_TenantId",
                table: "AtRiskFlags",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_TenantId_HireId",
                table: "AtRiskFlags",
                columns: new[] { "TenantId", "HireId" },
                unique: true,
                filter: "\"Status\" <> 3");

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_TenantId_HireId_Status",
                table: "AtRiskFlags",
                columns: new[] { "TenantId", "HireId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_TenantId_RaisedAt",
                table: "AtRiskFlags",
                columns: new[] { "TenantId", "RaisedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AtRiskFlags_TenantId_Status",
                table: "AtRiskFlags",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_HireId",
                table: "EngagementSnapshots",
                column: "HireId");

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_JourneyId",
                table: "EngagementSnapshots",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_TenantId",
                table: "EngagementSnapshots",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_TenantId_Classification",
                table: "EngagementSnapshots",
                columns: new[] { "TenantId", "Classification" });

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_TenantId_HireId_ComputedAt",
                table: "EngagementSnapshots",
                columns: new[] { "TenantId", "HireId", "ComputedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_EngagementSnapshots_TenantId_JourneyId_ComputedAt",
                table: "EngagementSnapshots",
                columns: new[] { "TenantId", "JourneyId", "ComputedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AtRiskFlags");

            migrationBuilder.DropTable(
                name: "EngagementSnapshots");
        }
    }
}

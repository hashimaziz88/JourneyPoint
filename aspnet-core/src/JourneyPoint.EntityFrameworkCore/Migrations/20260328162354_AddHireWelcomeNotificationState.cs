using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddHireWelcomeNotificationState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WelcomeNotificationFailureReason",
                table: "Hires",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WelcomeNotificationLastAttemptedAt",
                table: "Hires",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WelcomeNotificationSentAt",
                table: "Hires",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WelcomeNotificationStatus",
                table: "Hires",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Hires_TenantId_WelcomeNotificationStatus",
                table: "Hires",
                columns: new[] { "TenantId", "WelcomeNotificationStatus" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Hires_TenantId_WelcomeNotificationStatus",
                table: "Hires");

            migrationBuilder.DropColumn(
                name: "WelcomeNotificationFailureReason",
                table: "Hires");

            migrationBuilder.DropColumn(
                name: "WelcomeNotificationLastAttemptedAt",
                table: "Hires");

            migrationBuilder.DropColumn(
                name: "WelcomeNotificationSentAt",
                table: "Hires");

            migrationBuilder.DropColumn(
                name: "WelcomeNotificationStatus",
                table: "Hires");
        }
    }
}

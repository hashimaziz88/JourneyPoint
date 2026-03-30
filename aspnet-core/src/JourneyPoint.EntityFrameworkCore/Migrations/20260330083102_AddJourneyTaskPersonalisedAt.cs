using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyPoint.Migrations
{
    /// <inheritdoc />
    public partial class AddJourneyTaskPersonalisedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PersonalisedAt",
                table: "JourneyTasks",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PersonalisedAt",
                table: "JourneyTasks");
        }
    }
}

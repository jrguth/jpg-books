using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gable.Api.Migrations
{
    /// <inheritdoc />
    public partial class GoogleId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleId",
                table: "Books",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Books_GoogleId",
                table: "Books",
                column: "GoogleId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_GoogleId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "GoogleId",
                table: "Books");
        }
    }
}

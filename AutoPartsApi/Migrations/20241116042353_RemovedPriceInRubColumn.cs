using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations
{
    /// <inheritdoc />
    public partial class RemovedPriceInRubColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceInRub",
                table: "AutoParts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PriceInRub",
                table: "AutoParts",
                type: "decimal(10,2)",
                nullable: true);
        }
    }
}

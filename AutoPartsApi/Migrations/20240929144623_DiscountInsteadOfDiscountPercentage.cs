using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations {
	/// <inheritdoc />
	public partial class DiscountInsteadOfDiscountPercentage : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropColumn(
				name: "DiscountPercentage",
				table: "AutoPartSoldAmount");

			migrationBuilder.DropColumn(
				name: "DiscountPercentage",
				table: "AutoParts");

			migrationBuilder.AddColumn<decimal>(
				name: "Discount",
				table: "AutoPartSoldAmount",
				type: "decimal(18,2)",
				nullable: false,
				defaultValue: 0m);

			migrationBuilder.AddColumn<decimal>(
				name: "Discount",
				table: "AutoParts",
				type: "decimal(18,2)",
				nullable: false,
				defaultValue: 0m);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropColumn(
				name: "Discount",
				table: "AutoPartSoldAmount");

			migrationBuilder.DropColumn(
				name: "Discount",
				table: "AutoParts");

			migrationBuilder.AddColumn<byte>(
				name: "DiscountPercentage",
				table: "AutoPartSoldAmount",
				type: "tinyint",
				nullable: true);

			migrationBuilder.AddColumn<byte>(
				name: "DiscountPercentage",
				table: "AutoParts",
				type: "tinyint",
				nullable: true);
		}
	}
}
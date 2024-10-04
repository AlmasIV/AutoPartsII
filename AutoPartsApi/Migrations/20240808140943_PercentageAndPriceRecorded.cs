using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations {
	/// <inheritdoc />
	public partial class PercentageAndPriceRecorded : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.AddColumn<byte>(
				name: "DiscountPercentage",
				table: "AutoPartSoldAmount",
				type: "tinyint",
				nullable: false,
				defaultValue: (byte)0);

			migrationBuilder.AddColumn<decimal>(
				name: "Price",
				table: "AutoPartSoldAmount",
				type: "decimal(10,2)",
				nullable: false,
				defaultValue: 0m);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropColumn(
				name: "DiscountPercentage",
				table: "AutoPartSoldAmount");

			migrationBuilder.DropColumn(
				name: "Price",
				table: "AutoPartSoldAmount");
		}
	}
}
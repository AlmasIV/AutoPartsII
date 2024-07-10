using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations {
	/// <inheritdoc />
	public partial class AutoPartTableCreation : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.CreateTable(
				name: "AutoParts",
				columns: table => new {
					Id = table.Column<int>(type: "int", nullable: false)
						.Annotation("SqlServer:Identity", "1, 1"),
					Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Applicability = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
					PriceInRub = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
					PriceInKzt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
					Amount = table.Column<int>(type: "int", nullable: false)
				},
				constraints: table => {
					table.PrimaryKey("PK_AutoParts", x => x.Id);
				});
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropTable(
				name: "AutoParts");
		}
	}
}
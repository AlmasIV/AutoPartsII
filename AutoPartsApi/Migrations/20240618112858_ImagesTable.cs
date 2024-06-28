using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations
{
	/// <inheritdoc />
	public partial class ImagesTable : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "Images",
				columns: table => new
				{
					Id = table.Column<int>(type: "int", nullable: false)
						.Annotation("SqlServer:Identity", "1, 1"),
					Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Data = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
					ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
					AutoPartId = table.Column<int>(type: "int", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Images", x => x.Id);
					table.ForeignKey(
						name: "FK_Images_AutoParts_AutoPartId",
						column: x => x.AutoPartId,
						principalTable: "AutoParts",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_Images_AutoPartId",
				table: "Images",
				column: "AutoPartId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "Images");
		}
	}
}
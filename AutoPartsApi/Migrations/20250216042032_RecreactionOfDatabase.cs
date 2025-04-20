using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations {
	/// <inheritdoc />
	public partial class RecreactionOfDatabase : Migration {
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.CreateTable(
				name: "AutoParts",
				columns: table => new {
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
					Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Applicability = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
					PriceInKzt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
					Amount = table.Column<int>(type: "int", nullable: false),
					Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
					Discount = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
				},
				constraints: table => {
					table.PrimaryKey("PK_AutoParts", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Orders",
				columns: table => new {
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
					TotalPriceInKzt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
					CreatedOn = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
				},
				constraints: table => {
					table.PrimaryKey("PK_Orders", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Images",
				columns: table => new {
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
					Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Data = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
					ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
					AutoPartId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
				},
				constraints: table => {
					table.PrimaryKey("PK_Images", x => x.Id);
					table.ForeignKey(
						name: "FK_Images_AutoParts_AutoPartId",
						column: x => x.AutoPartId,
						principalTable: "AutoParts",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "AutoPartSoldAmount",
				columns: table => new {
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
					AutoPartId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					SoldAmount = table.Column<int>(type: "int", nullable: false),
					Discount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
					Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
				},
				constraints: table => {
					table.PrimaryKey("PK_AutoPartSoldAmount", x => x.Id);
					table.ForeignKey(
						name: "FK_AutoPartSoldAmount_AutoParts_AutoPartId",
						column: x => x.AutoPartId,
						principalTable: "AutoParts",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_AutoPartSoldAmount_Orders_OrderId",
						column: x => x.OrderId,
						principalTable: "Orders",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_AutoPartSoldAmount_AutoPartId",
				table: "AutoPartSoldAmount",
				column: "AutoPartId");

			migrationBuilder.CreateIndex(
				name: "IX_AutoPartSoldAmount_OrderId",
				table: "AutoPartSoldAmount",
				column: "OrderId");

			migrationBuilder.CreateIndex(
				name: "IX_Images_AutoPartId",
				table: "Images",
				column: "AutoPartId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropTable(
				name: "AutoPartSoldAmount");

			migrationBuilder.DropTable(
				name: "Images");

			migrationBuilder.DropTable(
				name: "Orders");

			migrationBuilder.DropTable(
				name: "AutoParts");
		}
	}
}
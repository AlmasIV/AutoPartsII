using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedOrdersAndSoldAmountTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalPriceInKzt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AutoPartOrder",
                columns: table => new
                {
                    AutoPartsId = table.Column<int>(type: "int", nullable: false),
                    OrdersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutoPartOrder", x => new { x.AutoPartsId, x.OrdersId });
                    table.ForeignKey(
                        name: "FK_AutoPartOrder_AutoParts_AutoPartsId",
                        column: x => x.AutoPartsId,
                        principalTable: "AutoParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AutoPartOrder_Orders_OrdersId",
                        column: x => x.OrdersId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AutoPartSoldAmount",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AutoPartId = table.Column<int>(type: "int", nullable: false),
                    SoldAmount = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
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
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutoPartOrder_OrdersId",
                table: "AutoPartOrder",
                column: "OrdersId");

            migrationBuilder.CreateIndex(
                name: "IX_AutoPartSoldAmount_AutoPartId",
                table: "AutoPartSoldAmount",
                column: "AutoPartId");

            migrationBuilder.CreateIndex(
                name: "IX_AutoPartSoldAmount_OrderId",
                table: "AutoPartSoldAmount",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutoPartOrder");

            migrationBuilder.DropTable(
                name: "AutoPartSoldAmount");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}

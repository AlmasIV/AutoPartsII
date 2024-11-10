using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations
{
    /// <inheritdoc />
    public partial class removed_cumbersome_auto_parts_navigations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutoPartOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_AutoPartOrder_OrdersId",
                table: "AutoPartOrder",
                column: "OrdersId");
        }
    }
}

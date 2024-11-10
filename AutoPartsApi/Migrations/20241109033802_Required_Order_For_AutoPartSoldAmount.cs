using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoPartsApi.Migrations
{
    /// <inheritdoc />
    public partial class Required_Order_For_AutoPartSoldAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AutoPartSoldAmount_Orders_OrderId",
                table: "AutoPartSoldAmount");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "AutoPartSoldAmount",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AutoPartSoldAmount_Orders_OrderId",
                table: "AutoPartSoldAmount",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AutoPartSoldAmount_Orders_OrderId",
                table: "AutoPartSoldAmount");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "AutoPartSoldAmount",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_AutoPartSoldAmount_Orders_OrderId",
                table: "AutoPartSoldAmount",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id");
        }
    }
}

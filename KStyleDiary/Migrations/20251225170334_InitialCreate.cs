using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KStyleDiary.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Looks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    Mood = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    CreatingDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    OwnerId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Looks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Brand = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Country = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    Price = table.Column<decimal>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LookProducts",
                columns: table => new
                {
                    LookId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    UsageNote = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LookProducts", x => new { x.LookId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_LookProducts_Looks_LookId",
                        column: x => x.LookId,
                        principalTable: "Looks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LookProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LookProducts_ProductId",
                table: "LookProducts",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LookProducts");

            migrationBuilder.DropTable(
                name: "Looks");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}

﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AutoPartsApi.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20240512095005_AddedOrdersAndSoldAmountTables")]
    partial class AddedOrdersAndSoldAmountTables
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.18")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("AutoPartOrder", b =>
                {
                    b.Property<int>("AutoPartsId")
                        .HasColumnType("int");

                    b.Property<int>("OrdersId")
                        .HasColumnType("int");

                    b.HasKey("AutoPartsId", "OrdersId");

                    b.HasIndex("OrdersId");

                    b.ToTable("AutoPartOrder");
                });

            modelBuilder.Entity("AutoPartsApi.Models.AutoPart", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "amount");

                    b.Property<string>("Applicability")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasAnnotation("Relational:JsonPropertyName", "applicability");

                    b.Property<string>("Company")
                        .HasColumnType("nvarchar(max)")
                        .HasAnnotation("Relational:JsonPropertyName", "company");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasAnnotation("Relational:JsonPropertyName", "name");

                    b.Property<decimal>("PriceInKzt")
                        .HasColumnType("decimal(10, 2)")
                        .HasAnnotation("Relational:JsonPropertyName", "priceInKzt");

                    b.Property<decimal>("PriceInRub")
                        .HasColumnType("decimal(10, 2)")
                        .HasAnnotation("Relational:JsonPropertyName", "priceInRub");

                    b.HasKey("Id");

                    b.ToTable("AutoParts");
                });

            modelBuilder.Entity("AutoPartsApi.Models.AutoPartSoldAmount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AutoPartId")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "autoPartId");

                    b.Property<int?>("OrderId")
                        .HasColumnType("int");

                    b.Property<int>("SoldAmount")
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "soldAmount");

                    b.HasKey("Id");

                    b.HasIndex("AutoPartId");

                    b.HasIndex("OrderId");

                    b.ToTable("AutoPartSoldAmount");
                });

            modelBuilder.Entity("AutoPartsApi.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("Relational:JsonPropertyName", "id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedOn")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2(0)")
                        .HasDefaultValueSql("SYSUTCDATETIME()")
                        .HasAnnotation("Relational:JsonPropertyName", "createdOn");

                    b.Property<decimal>("TotalPriceInKzt")
                        .HasColumnType("decimal(10, 2)")
                        .HasAnnotation("Relational:JsonPropertyName", "totalPriceInKzt");

                    b.HasKey("Id");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("AutoPartOrder", b =>
                {
                    b.HasOne("AutoPartsApi.Models.AutoPart", null)
                        .WithMany()
                        .HasForeignKey("AutoPartsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AutoPartsApi.Models.Order", null)
                        .WithMany()
                        .HasForeignKey("OrdersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AutoPartsApi.Models.AutoPartSoldAmount", b =>
                {
                    b.HasOne("AutoPartsApi.Models.AutoPart", "AutoPart")
                        .WithMany()
                        .HasForeignKey("AutoPartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AutoPartsApi.Models.Order", null)
                        .WithMany("AutoPartsSoldAmounts")
                        .HasForeignKey("OrderId");

                    b.Navigation("AutoPart");
                });

            modelBuilder.Entity("AutoPartsApi.Models.Order", b =>
                {
                    b.Navigation("AutoPartsSoldAmounts");
                });
#pragma warning restore 612, 618
        }
    }
}

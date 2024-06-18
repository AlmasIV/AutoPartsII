using Microsoft.EntityFrameworkCore;
using AutoPartsApi.Models;

public class AppDbContext : DbContext {
    public DbSet<AutoPart> AutoParts => Set<AutoPart>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Image> Images => Set<Image>();
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions){}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AutoPart>()
            .HasMany(part => part.Orders)
            .WithMany(order => order.AutoParts);

        modelBuilder.Entity<Order>()
            .Property(p => p.CreatedOn)
            .HasDefaultValueSql("SYSUTCDATETIME()");
    }
}
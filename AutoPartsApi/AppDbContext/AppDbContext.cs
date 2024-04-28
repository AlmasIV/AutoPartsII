using Microsoft.EntityFrameworkCore;
using AutoPartsApi.Models;

public class AppDbContext : DbContext {
    public DbSet<AutoPart> AutoParts => Set<AutoPart>();
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions){}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
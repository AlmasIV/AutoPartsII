using AutoPartsApi.Models;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext {
	public DbSet<AutoPart> AutoParts => Set<AutoPart>();
	public DbSet<Order> Orders => Set<Order>();
	public DbSet<Image> Images => Set<Image>();
	public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }

	protected override void OnModelCreating(ModelBuilder modelBuilder) {

		modelBuilder.Entity<Order>()
			.Property(p => p.CreatedOn)
			.HasDefaultValueSql("SYSUTCDATETIME()");
		
	}
}
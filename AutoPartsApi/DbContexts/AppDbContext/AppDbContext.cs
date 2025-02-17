using AutoPartsApi.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

public class AppDbContext : DbContext {
	public DbSet<AutoPart> AutoParts => Set<AutoPart>();
	public DbSet<Order> Orders => Set<Order>();
	public DbSet<Image> Images => Set<Image>();
	public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }

	protected override void OnModelCreating(ModelBuilder modelBuilder) {

		modelBuilder.Entity<Order>()
			.Property(p => p.CreatedOn)
			.HasDefaultValueSql("SYSUTCDATETIME()");

		foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes()) {
			IMutableKey? primaryKey = entityType.FindPrimaryKey();

			if (primaryKey is not null) {
				IMutableProperty pkProperty = primaryKey.Properties.First();
				if (pkProperty.ClrType == typeof(Guid)) {
					modelBuilder.Entity(entityType.ClrType)
						.Property(pkProperty.Name)
						.HasDefaultValueSql("NEWID()");
				}
			}
		}
	}
}
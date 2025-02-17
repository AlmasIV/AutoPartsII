using AutoPartsApi.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AuthDbContext : IdentityDbContext<IdentityUser> {
	public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
	public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
	protected override void OnModelCreating(ModelBuilder builder) {
		base.OnModelCreating(builder);

		builder.Entity<RefreshToken>()
			.Property(rt => rt.Id)
			.HasDefaultValueSql("NEWID()");
	}
}
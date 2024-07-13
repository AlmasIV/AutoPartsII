using AutoPartsApi.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AuthDbContext : IdentityDbContext<IdentityUser> {
	public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
	public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
}
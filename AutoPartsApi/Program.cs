using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using AutoPartsApi.Services;

namespace AutoPartsApi;
public class Program {
	public static void Main(string[] args) {
		var builder = WebApplication.CreateBuilder(args);

		builder.WebHost.ConfigureKestrel(options => {
			options.Limits.MaxRequestBodySize = 15 * 1024 * 1024;
		});

		builder.Services.AddControllers();

		builder.Services.AddCors(options => {
			options.AddDefaultPolicy(policy => {
				policy.WithOrigins("https://localhost:3000/", "http://localhost:3000/", "https://localhost:3000", "http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
			});
		});

		builder.Services.AddDbContext<AppDbContext>(options => {
			options.UseSqlServer(builder.Configuration.GetConnectionString("AutoParts") ?? throw new InvalidOperationException("AutoParts connection string wasn't found."), sqlOptions => {
				sqlOptions.EnableRetryOnFailure();
			}).LogTo(Console.WriteLine, LogLevel.Error);
		});

		builder.Services.AddDbContext<AuthDbContext>(options => {
			options.UseSqlServer(
				builder.Configuration.GetConnectionString("Identity") ?? throw new InvalidOperationException("Identity connection string wasn't found.")
			);
		});

		builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => {
			options.Password.RequiredLength = 8;
			options.Password.RequireDigit = false;
			options.Password.RequireLowercase = false;
			options.Password.RequireUppercase = false;
			options.Password.RequireNonAlphanumeric = false;
			options.SignIn.RequireConfirmedAccount = false; // Change to true.
			options.User.RequireUniqueEmail = true;
		})
		.AddEntityFrameworkStores<AuthDbContext>();

		builder.Services.AddAuthentication(options => {
			options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
			options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		}).AddJwtBearer(options => {
			options.TokenValidationParameters = new TokenValidationParameters() {
				ValidateIssuer = true,
				ValidIssuer = builder.Configuration["AuthenticationOptions:Issuer"] ?? throw new InvalidOperationException("Issuer field is missing. Configuration of identity system failed."),
				ValidateAudience = true,
				ValidAudience = builder.Configuration["AuthenticationOptions:Audience"] ?? throw new InvalidOperationException("Audience field is missing. Configuration of identity system failed."),
				ValidateLifetime = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AuthenticationOptions:Key"] ?? throw new InvalidOperationException("Signing key is missing. Configuration of identity system failed."))),
				ValidateIssuerSigningKey = true
			};
		});

		builder.Services.AddAuthorization(
			options => {
				options.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
					.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
					.RequireAuthenticatedUser()
					.Build()
				);
			}
		);

		builder.Services.AddSingleton<AbstractTokenGenerator, TokenGenerator>();

		var app = builder.Build();

		app.UseCors();

		app.UseAuthentication();

		app.UseAuthorization();

		app.MapControllers();

		app.Run();
	}
}
using AutoPartsApi.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

/*
	Things to do:
		1) Clean up the program.cs file.
		2) Introduce caching.
		3) Get familiar with user secrets in production.
		4) Find a way to generate private / public keys at runtime during app startup?
*/

namespace AutoPartsApi;
public class Program {
	public static void Main(string[] args) {
		var builder = WebApplication.CreateBuilder(args);

		builder.WebHost.ConfigureKestrel(options => {
			options.Limits.MaxRequestBodySize = 15 * 1024 * 1024;
		});

		builder.Services.AddSingleton<JwtRsaKeys>();

		builder.Services.AddHostedService<RsaKeyGeneratorService>();

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
				ValidIssuer = builder.Configuration["AuthenticationOptions:Issuer"]!,
				ValidateAudience = true,
				ValidAudience = builder.Configuration["AuthenticationOptions:Audience"]!,
				ValidateLifetime = true,
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
		builder.Services.AddSingleton<IPostConfigureOptions<JwtBearerOptions>, JwtPostConfigurations>();

		var app = builder.Build();

		app.UseCors();

		app.UseAuthentication();

		app.UseAuthorization();

		app.MapControllers();

		app.Run();
	}
}
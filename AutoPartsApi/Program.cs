using System.Text;

using AutoPartsApi.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi;
/*
	1) Improve exception handling on the global level, and also improve it at the individual level like controller's action methods.
	2) Remember to encrypt your database!
	3) Keep secrets in a safe place!
	4) Add two-factor authentication, password reset and so on...
	5) Data protection: https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/introduction?view=aspnetcore-8.0.
	6) Maybe document all your custom types?
*/
public class Program {
	public static void Main(string[] args) {
		var builder = WebApplication.CreateBuilder(args);

		builder.Services.AddControllers();

		builder.Services.AddHttpLogging(options => { });

		builder.Services.AddCors(options => {
			options.AddDefaultPolicy(policy => {
				policy.WithOrigins("https://localhost:3000/", "http://localhost:3000/", "https://localhost:3000", "http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
			});
		});

		builder.Services.AddDbContext<AppDbContext>(options => {
			options.UseSqlServer(builder.Configuration.GetConnectionString("AutoParts") ?? throw new NullReferenceException("AutoParts connection string wasn't found."), sqlOptions => {
				sqlOptions.EnableRetryOnFailure();
			});
		});

		builder.Services.AddDbContext<AuthDbContext>(options => {
			options.UseSqlServer(
				builder.Configuration["ConnectionStrings:Identity"],
				options => options.MigrationsAssembly("AutoPartsApi")
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
				ValidIssuer = builder.Configuration["AuthenticationOptions:Issuer"],
				ValidateAudience = true,
				ValidAudience = builder.Configuration["AuthenticationOptions:Audience"],
				ValidateLifetime = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AuthenticationOptions:Key"]!)),
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

		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		var app = builder.Build();

		app.UseHttpLogging();

		if (app.Environment.IsDevelopment()) {
			app.UseSwagger();
			app.UseSwaggerUI();
			app.UseDeveloperExceptionPage();
		}
		else {
			app.UseExceptionHandler("/error");
		}

		app.UseHttpsRedirection();

		app.UseCors();

		app.UseAuthentication();

		app.UseAuthorization();

		app.MapControllers();

		app.Run();
	}
}
using System.Diagnostics;
using System.Text;
using System.Text.Json;

using AutoPartsApi.Services;
using AutoPartsApi.Utils;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

		builder.WebHost.ConfigureKestrel(options => {
			options.Limits.MaxRequestBodySize = 15 * 1024 * 1024;
		});

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
			}).LogTo(Console.WriteLine, LogLevel.Error);
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

		var app = builder.Build();

		app.UseExceptionHandler(errorApp => {
			errorApp.Run(async context => {
				ILogger logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
				Exception? exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

				ProblemDetails problemDetails = new ProblemDetails() {
					Title = "An unexpected error occurred.",
					Status = StatusCodes.Status500InternalServerError,
					Detail = "This was an unexpected error, please contact the developers.",
					Instance = context.Request.Path
				};

				string traceId = Activity.Current?.TraceId.ToString() ?? context.TraceIdentifier ?? "No Trace Identifier";

				logger.LogError(exception, "Something went wrong. Trace Identifier:  {traceId}.", traceId);

				context.Response.StatusCode = StatusCodes.Status500InternalServerError;
				context.Response.ContentType = "application/problem+json";

				await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
			});
		});

		app.UseStatusCodePages(async context => {
			ILogger logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
			HttpResponse response = context.HttpContext.Response;
			ProblemDetails problemDetails = new ProblemDetails() {
				Status = response.StatusCode,
				Title = HttpStatusTextProvider.GetHttpStatusText(response.StatusCode),
				Instance = context.HttpContext.Request.Path
			};
			string traceId = Activity.Current?.TraceId.ToString() ?? context.HttpContext.TraceIdentifier ?? "No Trace Identifier";
			problemDetails.Extensions["traceId"] = traceId;

			response.ContentType = "application/problem+json";

			await response.WriteAsync(JsonSerializer.Serialize(problemDetails));
		});

		//app.UseHttpLogging();

		if (app.Environment.IsDevelopment()) {
			app.UseDeveloperExceptionPage();
		}

		//app.UseHttpsRedirection();

		app.UseCors();

		app.UseAuthentication();

		app.UseAuthorization();

		app.Map("throw", (handler) => {
			throw new Exception("OOPPPS");
		});

		app.MapControllers();

		app.Run();
	}
}
using System.Text;

using AutoPartsApi.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi;

public class Program
{
	public static void Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		// Add services to the container.

		builder.Services.AddControllers();

		builder.Services.AddCors(options =>
		{
			options.AddDefaultPolicy(policy =>
			{
				policy.WithOrigins("https://localhost:3000/", "http://localhost:3000/", "https://localhost:3000", "http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
			});
		});

		builder.Services.AddDbContext<AppDbContext>(options =>
		{
			options.UseSqlServer(builder.Configuration.GetConnectionString("AutoParts") ?? throw new NullReferenceException("AutoParts connection string wasn't found."), sqlOptions =>
			{
				sqlOptions.EnableRetryOnFailure();
			});
		});

		builder.Services.AddDbContext<IdentityDbContext>(options =>
		{
			options.UseSqlServer(
				builder.Configuration["ConnectionStrings:Identity"],
				options => options.MigrationsAssembly("AutoPartsApi")
			);
		});

		builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
		{
			options.Password.RequiredLength = 8;
			options.Password.RequireDigit = false;
			options.Password.RequireLowercase = false;
			options.Password.RequireUppercase = false;
			options.Password.RequireNonAlphanumeric = false;
			options.SignIn.RequireConfirmedAccount = false;
			options.User.RequireUniqueEmail = true;
		}).AddEntityFrameworkStores<IdentityDbContext>();

		builder.Services.AddAuthentication(options =>
		{
			options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
			options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		}).AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters()
				{
					ValidateIssuer = true,
					ValidIssuer = builder.Configuration["AuthenticationOptions:Issuer"],
					ValidateAudience = true,
					ValidAudience = builder.Configuration["AuthenticationOptions:Audience"],
					ValidateLifetime = true,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AuthenticationOptions:Key"]!)),
					ValidateIssuerSigningKey = true
				};
				options.Events = new JwtBearerEvents()
				{
					OnMessageReceived = context =>
					{
						if (context.Request.Headers.ContainsKey("authorize"))
						{
							context.Token = context.Request.Headers["authorize"];
						}
						return Task.CompletedTask;
					}
				};
			});

		builder.Services.AddAuthorization();

		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		builder.Services.AddScoped<IJwtTokenManager, JwtTokenManager>();

		var app = builder.Build();

		// Configure the HTTP request pipeline.
		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
			app.UseDeveloperExceptionPage();
		}
		else
		{
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
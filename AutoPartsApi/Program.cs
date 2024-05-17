using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AutoPartsApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();

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

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseDeveloperExceptionPage();
        }
        else {
            app.UseExceptionHandler("/error");
        }

        app.UseHttpsRedirection();

        app.UseCors();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}

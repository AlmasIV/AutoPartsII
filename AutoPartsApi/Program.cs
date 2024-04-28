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
                policy.WithOrigins("http://localhost:3000");
            });
        });

        builder.Services.AddDbContext<AppDbContext>(options => {
            options.UseSqlServer(builder.Configuration.GetConnectionString("AutoParts") ?? throw new NullReferenceException("AutoParts connection string wasn't found."), sqlOptions => {
                sqlOptions.EnableRetryOnFailure();
            });
        });

        // builder.Services.AddDbContext<IdentityDbContext>(options => {
        //     options.UseSqlServer(builder.Configuration.GetConnectionString("Identity") ?? throw new NullReferenceException("Identity connection string wasn't found."), sqlOptions => {
        //         sqlOptions.EnableRetryOnFailure();
        //         sqlOptions.MigrationsAssembly("AutoPartsApi");
        //     });
        // });
        // builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => {
        //     options.Password.RequiredLength = 12;
        //     options.Password.RequireDigit = true;
        //     options.Password.RequiredUniqueChars = 2;
        //     options.Password.RequireLowercase = true;
        //     optio"auto-parts"ns.Password.RequireNonAlphanumeric = true;
        //     options.Password.RequireUppercase = true;

        //     options.User.RequireUniqueEmail = true;
        // }).AddEntityFrameworkStores<IdentityDbContext>().AddDefaultTokenProviders();

        // builder.Services.Configure<SecurityStampValidatorOptions>(options => {
        //     options.ValidationInterval = TimeSpan.FromMinutes(2);
        // });

        // builder.Services.AddAuthentication();
        // builder.Services.AddAuthorization();

        //builder.Services.AddDbContext<
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors();

        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}

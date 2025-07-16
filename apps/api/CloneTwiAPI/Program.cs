using CloneTwiAPI.DbServices;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace CloneTwiAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // DOCKER 

            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.ListenAnyIP(5000);
            });

            builder.Configuration
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            // HTTP CLIENT

            builder.Services.AddHttpClient();
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddHttpClient<AzureTranslatorService>();
            builder.Services.AddScoped<UserService>();

            // JWT

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes(builder.Configuration.GetValue<string>("JwtSettings:JwtKey")!))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.HttpContext.Request.Cookies["jwt"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // SQL 

            builder.Services.AddDbContext<CloneTwiContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            //SERVICES

            builder.Services.AddIdentityCore<ApplicationUser>(options =>
            {
            })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<CloneTwiContext>()
                .AddSignInManager();

            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddSingleton<GenerateJwtTokenService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<UserGetter>();
            builder.Services.AddScoped<MessageService>();

            builder.Services.AddControllers();

            // APP

            var app = builder.Build();

            app.UseCors("AllowReactApp");
            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

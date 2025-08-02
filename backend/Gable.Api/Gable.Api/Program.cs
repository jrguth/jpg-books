using System.Text;
using Gable.Api;
using Gable.Api.Db;
using Gable.Api.Services.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
IServiceCollection services = builder.Services;

services.AddDbContext<GableDb>(opt => opt.UseSqlite("Data source=gable.db"));

IConfiguration config = builder.Configuration;
services.AddOptions()
    .Configure<JwtConfig>(config.GetSection("Jwt"));

services
    .AddAuthorization()
    .AddCors(opts =>
    {
        opts.AddDefaultPolicy(p =>
        {
            p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
    })
    .AddAuthentication(opts =>
    {
        opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opts =>
    {
        opts.SaveToken = true;
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Issuer"],
            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? throw new Exception("Missing Jwt:Key in config")))
        };
    });

services.AddControllers();
services.AddSingleton<JwtService>();
var app = builder.Build();

app
    .UseRouting()
    .UseCors()
    .UseAuthentication()
    .UseAuthorization()
    .UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });

app.UseHttpsRedirection();

app.Run();
using System.Text;
using Gable.Api;
using Gable.Api.Db;
using Gable.Api.Services.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Web.Resource;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

IConfiguration config = builder.Configuration;
IServiceCollection services = builder.Services;

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

services.AddSingleton<JwtService>();
var app = builder.Build();

app
    .UseAuthentication()
    .UseAuthorization();

app.UseHttpsRedirection();

app.Run();
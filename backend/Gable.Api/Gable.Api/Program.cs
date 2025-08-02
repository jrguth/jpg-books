using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Web.Resource;
using Gable.Api.Db;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
IServiceCollection services = builder.Services;

services.AddDbContext<GableDb>(opt => opt.UseSqlite("Data source=gable.db"));

// Add services to the container.
// builder.Services.AddAuthentication();
// builder.Services.AddAuthorization();


var app = builder.Build();

app.UseHttpsRedirection();

app.Run();
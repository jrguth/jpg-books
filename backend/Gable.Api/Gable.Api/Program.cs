using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Web.Resource;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// builder.Services.AddAuthentication();
// builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

app.Run();
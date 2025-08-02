using System.Security.Claims;
using Gable.Api.Db.Models;

namespace Gable.Api.Services.Authentication;

public static class Utilities
{
    public static IEnumerable<Claim> GetUserClaims(this User user)
    {
        return new List<Claim>
        {
            new Claim("email", user.Email),
            new Claim("name", user.Name ?? ""),
            new Claim("userId", user.Id.ToString()),
            new Claim("userName", user.Username ?? ""),
        };
    }
}
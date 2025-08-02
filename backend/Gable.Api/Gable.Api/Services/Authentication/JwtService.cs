using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Gable.Api.Db.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Gable.Api.Services.Authentication;

public class JwtService
{
    private readonly JwtConfig _config;

    public JwtService(IOptions<JwtConfig> config)
    {
        _config = config.Value;
    }

    public AccessToken GenerateToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var handler = new  JwtSecurityTokenHandler();
        var tokenProperties = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _config.Issuer,
            Audience = _config.Audience,
            Expires = DateTime.UtcNow.AddMinutes(_config.AccessTokenExpirationMinutes),
            IssuedAt = DateTime.UtcNow,
            SigningCredentials = creds
        };
        SecurityToken token = handler.CreateToken(tokenProperties);
        string value = handler.WriteToken(token);
        return new AccessToken
        {
            Value = value,
            Expires = tokenProperties.Expires.Value,
        };
    }
}
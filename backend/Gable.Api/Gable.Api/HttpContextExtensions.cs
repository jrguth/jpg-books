namespace Gable.Api;

public static class HttpContextExtensions
{
    public static string? GetClaim(this HttpContext context, string type)
    {
        return context.User.Claims.FirstOrDefault(c => c.Type == type)?.Value;
    }
    public static string GetAccessToken(this HttpContext context)
    {
        string? token = context.Request.Headers.Authorization;
        if (string.IsNullOrEmpty(token)) throw new Exception("Invalid token");
        return token!.Replace("Bearer ", string.Empty);
    }

    public static Guid GetUserId(this HttpContext context)
    {
        var userId = context.GetClaim("userId");
        if (string.IsNullOrEmpty(userId)) throw new Exception("Missing use");
        return Guid.Parse(userId);
    }
}
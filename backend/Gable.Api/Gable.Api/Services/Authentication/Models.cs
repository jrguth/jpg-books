namespace Gable.Api.Services.Authentication;

public class AccessToken
{
    public required string Value { get; init; }
    public required DateTime Expires { get; init; }
}
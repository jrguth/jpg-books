using System;
using System.ComponentModel.DataAnnotations;

namespace Gable.Api.Services.Users;

public class CreateUserDTO
{
    [Required]
    public string Email { init; get; }

    [Required]
    public string Username { init; get; }

    [Required]
    public string Password { init; get; }

    public string? Name { get; init; }
}

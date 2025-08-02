using System.ComponentModel.DataAnnotations;

namespace Gable.Api.Db.Models;

public class User
{
    [Key]
    public Guid Id { get; init; }
    [Required, EmailAddress]
    public string Email { get; init; }
    public string UserName { get; init; }
    [Required]
    public string PasswordHash { get; init; }

    public string? Name { get; init; }
}
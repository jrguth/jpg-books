using System.ComponentModel.DataAnnotations;

public class UserBookRelationship
{
    [Required]
    public Guid BookId { get; init; }
    [Required]
    public Guid UserId { get; init; }
}
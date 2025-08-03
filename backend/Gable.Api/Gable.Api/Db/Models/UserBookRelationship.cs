using System.ComponentModel.DataAnnotations;
using Gable.Api.Db.Models;

public class UserBookRelationship
{
    [Required]
    public Guid BookId { get; init; }
    [Required]
    public Guid UserId { get; init; }
    
    public Book? Book { get; init; }
    
    public User? User { get; init; }
}
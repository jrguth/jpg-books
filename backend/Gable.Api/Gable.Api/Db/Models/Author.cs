
using System.ComponentModel.DataAnnotations;
using Gable.Api.Db.Models;

public class Author
{
    [Key]
    public Guid Id { get; init; }

    [Required]
    public string Name { get; init; }

    public List<Book> Books { get; init; } = new();
}
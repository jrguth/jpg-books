using System.ComponentModel.DataAnnotations;

namespace Gable.Api.Db.Models;

public class Book
{
    [Key]
    public Guid Id { get; init; }
    
    public string GoogleId { get; init; }
    [Required]
    public string Title { get; init; }

    public string? PublishDate { get; init; }

    public string? Subtitle { get; init; }

    public string? Description { get; init; }

    public string GoogleMetadata { get; init; } = "";
    
    public ICollection<BookGenreRelationship> BookGenres { get; init; } =  new List<BookGenreRelationship>();
    public ICollection<BookAuthorRelationship> BookAuthors { get; init; } = new List<BookAuthorRelationship>();
}
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

    public List<User> Users { get; init; } = new();
    public List<Genre> Genres { get; init; } = new();
    public List<Author> Authors { get; init; } = new();

    public List<BookAuthorRelationship> BookAuthors { get; init; } = new();

    public List<BookGenreRelationship> BookGenres { get; init; } = new();

    public List<UserBookRelationship> UserBooks { get; init; } = new();
}
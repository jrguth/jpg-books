using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Gable.Api.Db.Models;

public class Book
{
    [Key]
    public Guid Id { get; set; }

    public string GoogleId { get; set; }
    [Required]
    public string Title { get; set; }

    public string? PublishDate { get; set; }

    public string? Subtitle { get; set; }

    public string? Description { get; set; }

    public string GoogleMetadata { get; set; } = "";

    [JsonIgnore]
    public List<User> Users { get; set; } = new();
    public List<Genre> Genres { get; set; } = new();
    public List<Author> Authors { get; set; } = new();

    [JsonIgnore]
    public List<BookAuthorRelationship> BookAuthors { get; init; } = new();

    [JsonIgnore]
    public List<BookGenreRelationship> BookGenres { get; init; } = new();

    [JsonIgnore]
    public List<UserBookRelationship> UserBooks { get; init; } = new();
}
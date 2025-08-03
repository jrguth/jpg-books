using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Gable.Api.Db.Models;

public class Genre
{
    [Key]
    public Guid Id { init; get; }
    [Required]
    public string GenreName { get; init; }

    public List<Book> Books { get; init; } = new();

    [JsonIgnore]
    public List<BookGenreRelationship> BookGenres { get; init; } = new();

}
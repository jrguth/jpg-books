
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Gable.Api.Db.Models;

public class Author
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }

    public List<Book> Books { get; set; } = new();

    [JsonIgnore]
    public List<BookAuthorRelationship> BookAuthors { get; set; } = new();
}
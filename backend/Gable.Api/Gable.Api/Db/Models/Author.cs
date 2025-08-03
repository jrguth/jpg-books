
using System.ComponentModel.DataAnnotations;

public class Author
{
    [Key]
    public Guid Id { get; init; }

    [Required]
    public string Name { get; init; }

    public ICollection<BookAuthorRelationship> BookAuthorRelationships { get; init; }

}
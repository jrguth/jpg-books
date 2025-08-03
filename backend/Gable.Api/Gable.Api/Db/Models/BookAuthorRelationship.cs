using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class BookAuthorRelationship
{
    [Required]
    public Guid BookId { get; init; }

    [Required]
    public Guid AuthorId { get; init; }
    
    public Author? Author { get; init; }
}
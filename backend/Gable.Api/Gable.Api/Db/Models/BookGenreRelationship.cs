using System.ComponentModel.DataAnnotations;

public class BookGenreRelationship
{
    [Required]
    public Guid BookId { get; init; }

    [Required]
    public Guid GenreId { get; init; }
}
using System.ComponentModel.DataAnnotations;
using Gable.Api.Db.Models;

public class BookGenreRelationship
{
    [Required]
    public Guid BookId { get; set; }

    [Required]
    public Guid GenreId { get; set; }
    
    public Genre? Genre { get; set; }
    public Book? Book { get; set; }
}
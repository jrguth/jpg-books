using System.ComponentModel.DataAnnotations;

public class Genre
{
    [Key]
    public Guid Id { init; get; }
    [Required]
    public string GenreName { get; init; }

}
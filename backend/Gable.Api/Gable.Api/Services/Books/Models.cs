using System.ComponentModel.DataAnnotations;

namespace Gable.Api.Services.Books;

public class Models
{

}

public class AddBookRequestDTO
{
    [Required]
    public string GoogleId { get; init; }
    [Required]
    public string Title { get; init; }

    public string? PublishDate { get; init; }

    public string? Subtitle { get; init; }

    public string? Description { get; init; }

    public string GoogleMetadata { get; init; } = "";
}
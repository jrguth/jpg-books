using Gable.Api.Services.Books;

namespace Gable.Api.Controllers;

public class BooksController : ApiControllerBase
{
    private readonly BookService _bookService;

    public BooksController(BookService bookService)
    {
        _bookService = bookService;
    }
}
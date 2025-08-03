using Gable.Api.Services.Books;
using Microsoft.AspNetCore.Mvc;

namespace Gable.Api.Controllers;

public class BooksController : ApiControllerBase
{
    private readonly BookService _bookService;

    public BooksController(BookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _bookService.GetUserBooks(HttpContext.GetUserId());
        return Ok(books);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(Guid id)
    {
        await _bookService.DeleteBookById(id, HttpContext.GetUserId());
        return Ok();
    }
}
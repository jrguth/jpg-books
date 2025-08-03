using Gable.Api.Db;
using Microsoft.EntityFrameworkCore;

namespace Gable.Api.Services.Books;

public class BookService
{
    private readonly GableDb _db;

    public BookService(GableDb db)
    {
        _db = db;
    }

    public async Task DeleteBookById(Guid bookId, Guid userId)
    {
        await _db.UserBookRelationships
            .Where(ub => ub.BookId == bookId)
            .Where(ub => ub.UserId == userId)
            .ExecuteDeleteAsync();
    }
}
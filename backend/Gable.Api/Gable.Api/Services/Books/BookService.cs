using Gable.Api.Db;
using Gable.Api.Db.Models;
using Microsoft.EntityFrameworkCore;

namespace Gable.Api.Services.Books;

public class BookService
{
    private readonly GableDb _db;

    public BookService(GableDb db)
    {
        _db = db;
    }

    public async Task<List<Book>> GetUserBooks(Guid userId)
    {
        return await _db.UserBookRelationships
            .AsNoTracking()
            .Where(ub => ub.UserId == userId)
            .Include(ub => ub.Book.BookAuthors)
            .Include(ub => ub.Book.BookGenres)
            .Select(ub => ub.Book)
            .ToListAsync();
    }

    public async Task DeleteBookById(Guid bookId, Guid userId)
    {
        await _db.UserBookRelationships
            .Where(ub => ub.BookId == bookId)
            .Where(ub => ub.UserId == userId)
            .ExecuteDeleteAsync();
    }
}
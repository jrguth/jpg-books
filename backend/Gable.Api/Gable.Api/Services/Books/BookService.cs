using Gable.Api.Db;

namespace Gable.Api.Services.Books;

public class BookService
{
    private readonly GableDb _db;

    public BookService(GableDb db)
    {
        _db = db;
    }
}
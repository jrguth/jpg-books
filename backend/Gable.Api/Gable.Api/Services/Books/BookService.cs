using Gable.Api.Db;
using Gable.Api.Db.Models;
using Microsoft.EntityFrameworkCore;
using Gable.Api;
using System.Text.Json;
using System.Collections;

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
        return await _db.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Include(u => u.Books)
                .ThenInclude(b => b.Genres)
            .Include(u => u.Books)
                .ThenInclude(b => b.Authors)
            .SelectMany(u => u.Books)
            .ToListAsync();
    }

    public async Task DeleteBookById(Guid bookId, Guid userId)
    {
        await _db.UserBookRelationships
            .Where(ub => ub.BookId == bookId)
            .Where(ub => ub.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public async Task<Book> AddBook(AddBookRequestDTO addBook, Guid userId)
    {
        Console.WriteLine(userId);
        // Check if book already exists in the books table, if not write it out
        Book? book = await _db.Books
            .Include(b => b.Users.Where(ub => ub.Id == userId))
            .FirstOrDefaultAsync(b => b.GoogleId == addBook.GoogleId);

        // If the book doesn't exist, create a new one
        if (book == null)
        {
            book = new Book
            {
                GoogleId = addBook.GoogleId,
                Title = addBook.Title,
                PublishDate = addBook.PublishDate,
                Subtitle = addBook.Subtitle,
                Description = addBook.Description,
                GoogleMetadata = addBook.GoogleMetadata,
                Users = [_db.Users.First(u => u.Id == userId)],
            };
            
            // Grab the genres off of the book object
            var googleVolume = JsonSerializer.Deserialize<GoogleVolume>(book.GoogleMetadata, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            foreach (var category in googleVolume?.Categories ?? [])
            {
                // check that the genre exists in the table
                // If not, add it and a new relation
                CheckGenreAndBook(category, book);
            }

            // Check Author table
            foreach (var author in googleVolume?.Authors ?? [])
            {
                CheckAuthorAndBook(author, book);
            }

            _db.Books.Add(book);
        }

        await _db.SaveChangesAsync();

        // Return the book object
        return book;
    }

    private void CheckGenreAndBook(string genreName, Book book)
    {
        Genre? genre = _db.Genres.FirstOrDefault(g => g.GenreName == genreName);
        book.Genres.Add(genre ?? new Genre { GenreName = genreName });
    }

    private void CheckAuthorAndBook(string authorName, Book book)
    {
        Author? author = _db.Authors.FirstOrDefault(a => a.Name == authorName);
        book.Authors.Add(author ??  new Author { Name = authorName });
    }

    private class GoogleVolume
    {
        public string[] Categories { get; set; }
        public string[] Authors { get; set; }
    }
}

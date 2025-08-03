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
        // Check if book already exists in the books table, if not write it out
        Book book = await _db.Books
            .Include(b => b.UserBooks.Where(ub => ub.UserId == userId))
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
                UserBooks = new List<UserBookRelationship>
                {
                    new (){ UserId = userId }
                }
            };

            _db.Books.Add(book);

            // Grab the genres off of the book object
            var result = JsonSerializer.Deserialize<GoogleVolume>(book.GoogleMetadata);

            foreach (var category in result?.Categories ?? [])
            {
                // check that the genre exists in the table
                // If not, add it and a new relation
                CheckGenreAndBook(category, book);
            }

            // Check Author table
            foreach (var author in result?.Authors ?? [])
            {
                CheckAuthorAndBook(author, book);
            }
        }

        // Check if book already exists on the user (check relationship table)
        else if (!book.UserBooks.Any())
        {
            _db.UserBookRelationships.Add(new UserBookRelationship
            {
                UserId = userId,
                BookId = book.Id
            });
        }

        _db.SaveChanges();

        // Return the book object
        return book;
    }

    private void CheckGenreAndBook(string genreName, Book book)
    {
        Genre? genre = _db.Genres.FirstOrDefault(g => g.GenreName == genreName);

        // If the genre is not in the table, add it
        if (null == genre)
        {
            genre = new Genre
            {
                GenreName = genreName,
                GenreBooks = new List<BookGenreRelationship>
                {
                    new (){ BookId = book.Id }
                }

            };

            _db.Genres.Add(genre);
        }

        // Check that the relation already exists
        if (!genre.GenreBooks.Any(ub => ub.BookId == book.Id))
        {
            _db.BookGenreRelationships.Add(new BookGenreRelationship
            {
                GenreId = genre.Id,
                BookId = book.Id
            });
        }
    }

    private void CheckAuthorAndBook(string authorName, Book book)
    {
        Author? author = _db.Authors.FirstOrDefault(a => a.Name == authorName);

        // If the author is not in the table, add it
        if (null == author)
        {
            author = new Author
            {
                Name = authorName,
                BookAuthorRelationships = new List<BookAuthorRelationship>
                {
                    new (){ BookId = book.Id }
                }

            };

            _db.Authors.Add(author);
        }

        // Check that the relation already exists
        if (!author.BookAuthorRelationships.Any(ub => ub.BookId == book.Id))
        {
            _db.BookAuthorRelationships.Add(new BookAuthorRelationship
            {
                AuthorId = author.Id,
                BookId = book.Id
            });
        }
    }

    private class GoogleVolume
    {
        public string[] Categories { get; set; }
        public string[] Authors { get; set; }
    }
}

namespace Gable.Api.Db;

using Gable.Api.Db.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class GableDb : DbContext
{
    public DbSet<Book> Books { get; init; }
    public DbSet<Author> Authors { get; init; }
    public DbSet<Genre> Genres { get; init; }
    public DbSet<User> Users { get; init; }

    public DbSet<BookAuthorRelationship> BookAuthorRelationships { get; init; }

    public DbSet<UserBookRelationship> UserBookRelationships { get; init; }
    public DbSet<BookGenreRelationship> BookGenreRelationships { get; init; }
    public GableDb(DbContextOptions<GableDb> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserBookRelationship>()
            .HasKey(oi => new { oi.UserId, oi.BookId });

        modelBuilder.Entity<BookGenreRelationship>()
            .HasKey(oi => new { oi.GenreId, oi.BookId });

        modelBuilder.Entity<BookAuthorRelationship>()
            .HasKey(oi => new { oi.AuthorId, oi.BookId });

        modelBuilder.Entity<Book>()
            .HasMany(b => b.Users)
            .WithMany(u => u.Books)
            .UsingEntity<UserBookRelationship>();
        
        modelBuilder.Entity<Book>()
            .HasMany(b => b.Authors)
            .WithMany(a => a.Books)
            .UsingEntity<BookAuthorRelationship>();
        
        modelBuilder.Entity<Book>()
            .HasMany(b => b.Genres)
            .WithMany(a => a.Books)
            .UsingEntity<BookGenreRelationship>();
        
        modelBuilder.Entity<Book>()
            .HasIndex(b => b.GoogleId)
            .IsUnique();

        modelBuilder.Entity<Genre>()
            .HasIndex(g => g.GenreName)
            .IsUnique();
    }
    
}
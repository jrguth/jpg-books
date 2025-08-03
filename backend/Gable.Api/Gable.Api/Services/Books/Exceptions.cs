using System;

namespace Gable.Api.Services.Books;

public class UserAlreadyOwnsBookException : Exception
{
    public UserAlreadyOwnsBookException(string message = "User already owns this book") : base(message) { }
}

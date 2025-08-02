public class UserDoesNotExistException : Exception
{
    public UserDoesNotExistException(string message = "User does not exist") : base(message) { }
}

public class InvalidPasswordException : Exception
{
    public InvalidPasswordException(string message = "Invalid password") : base(message) { }
}
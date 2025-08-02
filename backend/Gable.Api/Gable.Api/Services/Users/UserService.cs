using System;
using Gable.Api.Db;
using Gable.Api.Db.Models;
using Gable.Api.Services.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Gable.Api.Services;

public class UserService
{
    private GableDb _gableDb;
    private PasswordHasher<User> passwordHasher;
    public UserService(GableDb gableDb)
    {
        _gableDb = gableDb;
        passwordHasher = new PasswordHasher<User>();
    }

    public async Task<User?> CreateUser(CreateUserDTO userModel)
    {
        // Check if the username exists
        User? existingUser = await _gableDb.Users
            .FirstOrDefaultAsync(u => u.Username == userModel.Username || u.Email == userModel.Email);

        if (existingUser != null) return null;

        // Construct User Entity
        var user = new User
        {
            Username = userModel.Username,
            Email = userModel.Email,
            Name = userModel.Name,
            // Hash the password
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userModel.Password)
        };

        // Save the User
        _gableDb.Users.Add(user);

        await _gableDb.SaveChangesAsync();

        return user;
    }

    public async Task<User> ValidateLogin(LoginDTO loginDTO)
    {
        // Try to find user
        User? user = await _gableDb.Users
            .FirstOrDefaultAsync(u => u.Email == loginDTO.EmailOrUsername || u.Username == loginDTO.EmailOrUsername);

        if (null == user) throw new UserDoesNotExistException();

        if (user.PasswordHash != BCrypt.Net.BCrypt.HashPassword(loginDTO.Password)) throw new InvalidPasswordException();

        return user;
    }

}

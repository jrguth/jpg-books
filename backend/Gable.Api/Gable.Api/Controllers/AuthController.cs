using Gable.Api.Db.Models;
using Gable.Api.Services;
using Gable.Api.Services.Authentication;
using Gable.Api.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gable.Api.Controllers;

public class AuthController : ApiControllerBase
{
    private UserService _userService;
    private JwtService _jwtService;

    public AuthController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO createUserDTO)
    {
        User? result = await _userService.CreateUser(createUserDTO);

        if (result == null)
        {
            return BadRequest("User already exists big dumb idiot");
        }

        return Ok(result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
    {
        User user;
        try
        {
            user = await _userService.ValidateLogin(loginDTO);

        }
        catch (Exception ex) when (ex is InvalidPasswordException || ex is UserDoesNotExistException)
        {
            return BadRequest(ex.Message);
        }
        
        return Ok(_jwtService.GenerateToken(user))
    }


}

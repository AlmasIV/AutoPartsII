using AutoPartsApi.DTOs;
using AutoPartsApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace AutoPartsApi.Controllers;

[Route("user")]
[ApiController()]
[AllowAnonymous()]
public class UserController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IJwtTokenManager _jwtTokenManager;
    public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IJwtTokenManager jwtTokenManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenManager = jwtTokenManager;
    }

    [HttpPost()]
    [Route("sign-up")]
    public async Task<IActionResult> SignUp([FromBody] SignUpModel signUpModel)
    {
        IdentityUser user = new IdentityUser()
        {
            UserName = signUpModel.Email,
            Email = signUpModel.Email
        };

        IdentityResult result = await _userManager.CreateAsync(user, signUpModel.Password);

        if (!result.Succeeded)
        {
            ProblemDetails problemDetails = new ProblemDetails()
            {
                Title = "User registration failed.",
                Status = StatusCodes.Status400BadRequest,
                Detail = "See the errors property for details.",
                Instance = HttpContext.Request.Path,
                Type = null
            };

            problemDetails.Extensions["errors"] = result.Errors.Select(e => new
            {
                e.Code,
                e.Description
            });
            return BadRequest(problemDetails);
        }

        Response.Cookies.Append("jwt", _jwtTokenManager.GenerateToken(user), new CookieOptions()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            MaxAge = TimeSpan.FromHours(2)
        });

        return Ok();
    }

    [HttpPost()]
    [Route("log-in")]
    public async Task<IActionResult> LogIn([FromBody] LogInModel logInModel)
    {
        IdentityUser? user = await _userManager.FindByEmailAsync(logInModel.Email);

        if (user is null || !(await _userManager.CheckPasswordAsync(user, logInModel.Password)))
        {
            return BadRequest(new ProblemDetails()
            {
                Title = "User log in failed.",
                Status = StatusCodes.Status400BadRequest,
                Detail = "User log in failed.",
                Instance = HttpContext.Request.Path,
                Type = null
            });
        }
        Response.Cookies.Append("jwt", _jwtTokenManager.GenerateToken(user), new CookieOptions()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            MaxAge = TimeSpan.FromHours(2)
        });

        return Ok();
    }
}
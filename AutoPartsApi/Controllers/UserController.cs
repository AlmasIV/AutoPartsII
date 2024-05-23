using AutoPartsApi.DTOs;
using AutoPartsApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace AutoPartsApi.Controllers;

[Route("user")]
[ApiController()]
[AllowAnonymous()]
public class UserController : ControllerBase {
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IJwtToken _jwtToken;
    public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IJwtToken jwtToken){
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtToken = jwtToken;
    }

    [HttpPost()]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody]RegisterModel registerModel){
        IdentityUser user = new IdentityUser(){
            UserName = registerModel.Email,
            Email = registerModel.Email
        };
        IdentityResult result = await _userManager.CreateAsync(user, registerModel.Password);

        if(!result.Succeeded){
            ProblemDetails problemDetails = new ProblemDetails(){
                Title = "User registration failed.",
                Status = StatusCodes.Status400BadRequest,
                Detail = "See the errors property for details.",
                Instance = HttpContext.Request.Path,
                Type = null
            };

            problemDetails.Extensions["errors"] = result.Errors.Select(e => new {
                e.Code,
                e.Description
            });
            return BadRequest(problemDetails);
        }

        Response.Cookies.Append("jwt", _jwtToken.GenerateToken(user), new CookieOptions{
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        });

        return Ok();
    }
}
using System.Security.Claims;

using AutoPartsApi.DTOs;
using AutoPartsApi.Models;
using AutoPartsApi.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

/*
	1) Somethings must be saved in config files (I think). For example expiration date for the refresh tokens, and its max-age?
	2) Need to study SameSite options. I think there is a potential for security improvement, otherwise I am wrong, but don't be afraid to be! Either way I will learn something new.
	3) Consider splitting-up some of the things your controller does.
	4) Is there an optimization stuff I can use? Like not awaiting immediately, or am I thinking in a wrong way?
*/

[Route("users")]
[ApiController()]
public class UsersController : ControllerBase {
	private readonly UserManager<IdentityUser> _userManager;
	private readonly AbstractTokenGenerator _TokenGenerator;
	private readonly AuthDbContext _authDbContext;
	public UsersController(UserManager<IdentityUser> userManager, AbstractTokenGenerator TokenGenerator, AuthDbContext authDbContext) {
		_userManager = userManager;
		_TokenGenerator = TokenGenerator;
		_authDbContext = authDbContext;
	}

	[HttpPost()]
	[Route("sign-up")]
	[AllowAnonymous()]
	public async Task<IActionResult> SignUp([FromBody] SignUpModel signUpModel) {
		IdentityUser user = new IdentityUser() {
			UserName = signUpModel.Email,
			Email = signUpModel.Email
		};

		IdentityResult result = await _userManager.CreateAsync(user, signUpModel.Password);

		if (!result.Succeeded) {
			ProblemDetails problemDetails = new ProblemDetails() {
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

		await _SetTokens(user, Response);

		return Ok();
	}

	[HttpPost()]
	[Route("log-in")]
	[AllowAnonymous()]
	public async Task<IActionResult> LogIn([FromBody] LogInModel logInModel) {
		IdentityUser? user = await _userManager.FindByEmailAsync(logInModel.Email);

		if (user is null || !(await _userManager.CheckPasswordAsync(user, logInModel.Password))) {
			return BadRequest(new ProblemDetails() {
				Title = "User log in failed.",
				Status = StatusCodes.Status400BadRequest,
				Detail = "User log in failed.",
				Instance = HttpContext.Request.Path,
				Type = null
			});
		}

		await _SetTokens(user, Response);

		return Ok();
	}

	[HttpGet()]
	[Route("info")]
	[Authorize("Bearer")]
	public IActionResult UserInfo() {
		string currentEmail = User.Claims.Single(cu => cu.Type == ClaimTypes.Email).Value;
		IdentityUser currentUser = _userManager.Users
			.AsNoTracking()
			.Single(u => u.Email == currentEmail);
		return Ok(new UserModel() {
			Email = currentUser.Email!,
			UserName = currentUser.UserName!
		});
	}

	[HttpGet()]
	[AllowAnonymous()]
	[Route("refresh-token/{refrestToken:guid}")]
	public async Task<IActionResult> RefreshToken(Guid refreshToken) {
		RefreshToken? savedToken = await _authDbContext.RefreshTokens
			.Include(rt => rt.User)
			.SingleOrDefaultAsync(rt => rt.Token == refreshToken);

		if (savedToken is not null) {
			_authDbContext.RefreshTokens.Remove(savedToken);
			await _authDbContext.SaveChangesAsync();
		}

		if (savedToken is null || DateTime.Now >= savedToken.ExpirationDateTime) {
			return BadRequest(new ProblemDetails() {
				Title = "Refresh token invalid.",
				Status = StatusCodes.Status400BadRequest,
				Detail = "Refresh token that was provided is invalid. Try to log-in again.",
				Instance = HttpContext.Request.Path,
				Type = null
			});
		}

		await _SetTokens(savedToken.User, Response);

		return Ok();
	}

	[NonAction()]
	private async Task _SetTokens(IdentityUser user, HttpResponse response) {
		response.Cookies.Append("jwt", _TokenGenerator.GenerateToken(user), new CookieOptions() {
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.None,
			MaxAge = TimeSpan.FromMinutes(30)
		});

		Guid refreshToken = _TokenGenerator.GenerateRefreshToken();
		await _authDbContext.RefreshTokens.AddAsync(new RefreshToken() {
			Token = refreshToken,
			ExpirationDateTime = DateTime.Now.Add(TimeSpan.FromHours(6)),
			User = user
		});

		await _authDbContext.SaveChangesAsync();

		response.Cookies.Append("refreshToken", refreshToken.ToString(), new CookieOptions() {
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.None,
			MaxAge = TimeSpan.FromHours(6)
		});
	}
}
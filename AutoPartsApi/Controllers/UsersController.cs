using AutoPartsApi.DTOs;
using AutoPartsApi.Models;
using AutoPartsApi.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

[Route("users")]
[ApiController()]
public class UsersController : ControllerBase {
	private readonly UserManager<IdentityUser> _userManager;
	private readonly AbstractTokenGenerator _tokenGenerator;
	private readonly AuthDbContext _authDbContext;
	public UsersController(UserManager<IdentityUser> userManager, AbstractTokenGenerator TokenGenerator, AuthDbContext authDbContext) {
		_userManager = userManager;
		_tokenGenerator = TokenGenerator;
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

		await SetTokens(user, Response);

		return Ok();
	}

	[HttpPost()]
	[Route("log-in")]
	[AllowAnonymous()]
	public async Task<IActionResult> LogIn([FromBody] LogInModel logInModel) {
		IdentityUser? user = await _userManager.FindByEmailAsync(logInModel.Email);

		if (user is null || !(await _userManager.CheckPasswordAsync(user, logInModel.Password))) {
			return BadRequest(
				new ProblemDetails() {
					Title = "User log in failed.",
					Status = StatusCodes.Status400BadRequest,
					Detail = "User log in failed.",
					Instance = HttpContext.Request.Path,
					Type = null
				}
			);
		}

		await SetTokens(user, Response);

		return Ok();
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
		}

		if (savedToken is null || DateTime.Now >= savedToken.ExpirationDateTime) {
			return BadRequest(
				new ProblemDetails() {
					Title = "Refresh token invalid.",
					Status = StatusCodes.Status400BadRequest,
					Detail = "Refresh token that was provided is invalid. Try to log-in again.",
					Instance = HttpContext.Request.Path,
					Type = null
				}
			);
		}

		await _authDbContext.SaveChangesAsync();
		await SetTokens(savedToken.User, Response);
		return Ok();
	}

	[NonAction()]
	private async Task SetTokens(IdentityUser user, HttpResponse response) {
		response.Cookies.Append("jwt", _tokenGenerator.GenerateToken(user), new CookieOptions() {
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.None,
			MaxAge = TimeSpan.FromMinutes(30)
		});

		Guid refreshToken = _tokenGenerator.GenerateRefreshToken();
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
			MaxAge = TimeSpan.FromHours(3)
		});
	}
}
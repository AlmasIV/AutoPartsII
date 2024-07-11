using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi.Services;

public class JwtTokenManager : IJwtTokenManager {
	/*
		1) Store the token using the browser sessionStorage container.
		2) Add it as a Bearer HTTP Authentication header with JavaScript when calling services.
		3) Add fingerprint information to the token.
		4) Use assymetric key.
		5) Store refresh tokens in a secure database.
		6) Access tokens must be short-alive.
		7) Refresh tokens must be stored securely at the client side, use HttpOnly?
		8) Use refresh token rotation.
		9) Revoke refresh tokens when suspicious activity is detected -->>> Study this, seems like an interesting thing.
		10) Access tokens are visibly, always use HTTPS, and don't transfer secure info.
	*/
	private readonly IConfiguration _configuration;
	public JwtTokenManager(IConfiguration configuration) {
		_configuration = configuration;
	}

	public string GenerateToken(IdentityUser user) {
		List<Claim> claims = new List<Claim>(){
			new Claim(ClaimTypes.Name, user.UserName!),
			new Claim(ClaimTypes.Email, user.Email!)
		};
		return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
			issuer: _configuration["AuthenticationOptions:Issuer"],
			audience: _configuration["AuthenticationOptions:Audience"],
			claims: claims,
			expires: DateTime.Now.Add(TimeSpan.FromHours(2)),
			signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AuthenticationOptions:Key"]!)), SecurityAlgorithms.HmacSha256)
		));
	}
}
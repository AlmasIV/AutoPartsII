using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi.Services;

public class JwtTokenManager : IJwtTokenManager {
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
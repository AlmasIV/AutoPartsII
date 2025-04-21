using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi.Services;

public class TokenGenerator : AbstractTokenGenerator {
	private readonly IConfiguration _configuration;
	private readonly JwtRsaKeys _jwtRsaKeys;
	private readonly ILogger<TokenGenerator> _logger;
	public TokenGenerator(IConfiguration configuration, JwtRsaKeys jwtRsaKeys, ILogger<TokenGenerator> logger) {
		_configuration = configuration;
		_jwtRsaKeys = jwtRsaKeys;
		_logger = logger;
	}

	public override string GenerateToken(IdentityUser user) {
		try {
			_logger.LogInformation("Generating token.");
			List<Claim> claims = new List<Claim>(){
				new Claim(ClaimTypes.Name, user.UserName!),
				new Claim(ClaimTypes.Email, user.Email!)
			};
			RSA rsa = RSA.Create();
			JwtRsaKeys.RsaKey rsaKey = _jwtRsaKeys.ValidKeys.First();
			rsa.ImportParameters(rsaKey.Parameters);
			SigningCredentials signingCredentials = new SigningCredentials(new RsaSecurityKey(rsa) { KeyId = rsaKey.KeyId }, SecurityAlgorithms.RsaSha256);
			return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
				issuer: _configuration["AuthenticationOptions:Issuer"],
				audience: _configuration["AuthenticationOptions:Audience"],
				claims: claims,
				expires: DateTime.Now.Add(TimeSpan.FromMinutes(30)),
				signingCredentials: signingCredentials
			));
		}
		catch (Exception ex) {
			_logger.LogError(ex, "Something went wrong on token generation.");
			throw;
		}
	}
	public override Guid GenerateRefreshToken() {
		_logger.LogInformation("Generating refresh token.");
		return Guid.NewGuid();
	}
}
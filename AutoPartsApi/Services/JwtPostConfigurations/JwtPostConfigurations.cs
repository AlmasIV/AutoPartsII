using System.Security.Cryptography;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AutoPartsApi.Services;

public class JwtPostConfigurations : IPostConfigureOptions<JwtBearerOptions> {
	private readonly JwtRsaKeys _jwtRsaKeys;
	private readonly ILogger<JwtPostConfigurations> _logger;
	public JwtPostConfigurations(JwtRsaKeys jwtRsaKeys, ILogger<JwtPostConfigurations> logger) {
		_jwtRsaKeys = jwtRsaKeys;
		_logger = logger;
	}
	public void PostConfigure(string? name, JwtBearerOptions options) {
		if (name is not null && name == JwtBearerDefaults.AuthenticationScheme) {
			options.TokenValidationParameters.IssuerSigningKeyResolver = _issuerSigningKeyResolver;
		}
	}
	private IEnumerable<SecurityKey> _issuerSigningKeyResolver(string token, SecurityToken securityToken, string keyId, TokenValidationParameters tokenValidationParameters) {
		ArgumentNullException.ThrowIfNull(keyId, "The key id was not provided.");
		JwtRsaKeys.RsaKey? jwtRsaKey = _jwtRsaKeys.ValidKeys.FirstOrDefault(rkp => rkp.KeyId == keyId);
		if (jwtRsaKey is null) {
			throw new ArgumentException("The key id doesn't exist.");
		}
		RSA rsa = RSA.Create(jwtRsaKey.Parameters);
		return new SecurityKey[] { new RsaSecurityKey(rsa) };
	}
}
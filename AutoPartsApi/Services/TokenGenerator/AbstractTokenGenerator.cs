using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Services;

public abstract class AbstractTokenGenerator {
	public abstract string GenerateToken(IdentityUser user);
	public abstract Guid GenerateRefreshToken();
}
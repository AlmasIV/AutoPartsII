using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Services;

public interface IJwtTokenManager
{
	public string GenerateToken(IdentityUser user);
}
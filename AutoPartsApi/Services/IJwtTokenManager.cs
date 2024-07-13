using Microsoft.AspNetCore.Identity;
using AutoPartsApi.Models;

namespace AutoPartsApi.Services;

public interface IJwtTokenManager {
	public string GenerateToken(IdentityUser user);
	public RefreshToken GenerateRefreshToken();
}
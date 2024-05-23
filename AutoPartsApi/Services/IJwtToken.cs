using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Services;

public interface IJwtToken {
    public string GenerateToken(IdentityUser user);
}
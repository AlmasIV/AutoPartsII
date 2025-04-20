using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Models;
public class RefreshToken {
	public Guid Id { get; set; }

	[Required()]
	public Guid Token { get; set; }

	[Required()]
	public DateTime ExpirationDateTime { get; set; }

	[Required()]
	public string UserId { get; set; } = null!;

	[Required()]
	public IdentityUser User { get; set; } = null!;
}
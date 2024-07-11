using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Models;
public class RefreshToken {
	[JsonIgnore()]
	public int Id { get; set; }

	[Required()]
	public Guid Token { get; set; }

	[Required()]
	[JsonIgnore()]
	public DateTime ExpirationDateTime { get; set; }

	[Required()]
	[JsonIgnore()]
	public int UserId { get; set; }

	[Required()]
	[JsonIgnore()]
	public IdentityUser User { get; set; } = null!;
}
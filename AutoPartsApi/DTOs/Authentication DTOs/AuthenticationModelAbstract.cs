using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public abstract class AuthenticationModelAbstract {
	[Required()]
	[EmailAddress()]
	public string Email { get; set; } = null!;

	[Required()]
	[MinLength(8)]
	public string Password { get; set; } = null!;
}
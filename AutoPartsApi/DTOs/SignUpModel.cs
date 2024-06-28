using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class SignUpModel
{
	[Required()]
	[EmailAddress()]
	public string Email { get; set; } = null!;

	[Required()]
	[MinLength(8)]
	public string Password { get; set; } = null!;

	[Required()]
	[MinLength(8)]
	[Compare("Password")]
	public string PasswordConfirmation { get; set; } = null!;
}
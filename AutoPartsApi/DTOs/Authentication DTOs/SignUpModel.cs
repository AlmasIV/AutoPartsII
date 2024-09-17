using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class SignUpModel : AuthenticationModelAbstract {

	[Required()]
	[MinLength(8)]
	[Compare("Password")]
	public string PasswordConfirmation { get; set; } = null!;
}
using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class UserModel {
    [Required()]
    [EmailAddress()]
    public string Email { get; set; } = null!;

    [Required()]
    [MinLength(2)]
    public string UserName { get; set; } = null!;
}
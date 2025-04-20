using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Authorize("Bearer")]
[Route("jwt/validate")]
public class JwtController : ControllerBase {
	private readonly ILogger<JwtController> _logger;
	public JwtController(ILogger<JwtController> logger) {
		_logger = logger;
	}

	[HttpGet()]
	public IActionResult Validate() {
		_logger.LogInformation("Token is validated.");
		return Ok(new { message = "Token is valid" });
	}
}
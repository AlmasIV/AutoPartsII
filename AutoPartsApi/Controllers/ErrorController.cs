using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

[ApiController()]
public class ErrorController : ControllerBase {
	private readonly AppDbContext _appDbContext;
	public ErrorController(AppDbContext appDbContext) {
		_appDbContext = appDbContext;
	}
	[Route("/error")]
	[ApiExplorerSettings(IgnoreApi = true)]
	public IActionResult HandleError() {
		// Need to log the unexpected exception.

		return Problem(
			type: null,
			statusCode: StatusCodes.Status500InternalServerError,
			title: "Something went wrong.",
			detail: "Try to report the problem.",
			instance: null
		);
	}
}
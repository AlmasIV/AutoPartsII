using AutoPartsApi.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Filters;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class AutoPartUpdateValidationAttribute : Attribute, IAsyncActionFilter {
	private readonly AppDbContext _appDbContext;
	public AutoPartUpdateValidationAttribute(AppDbContext appDbContext) {
		_appDbContext = appDbContext;
	}
	public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
		int autoPartId = (int)(context.ActionArguments["id"] ?? 0);
		AutoPart? autoPart = context.ActionArguments["updatedAutoPart"] as AutoPart;
		List<IFormFile>? images = context.ActionArguments["images"] as List<IFormFile>;

		if (autoPart is null || images is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The required data wasn't present.",
					Detail = "Data for the update wasn't present. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		

		await next();
	}
}
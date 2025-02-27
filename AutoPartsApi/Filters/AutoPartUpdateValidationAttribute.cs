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
		Guid autoPartId = Guid.Parse(context.ActionArguments["id"]!.ToString()!);
		AutoPart autoPart = (context.ActionArguments["updatedAutoPart"] as AutoPart)!;
		List<IFormFile> images = (context.ActionArguments["images"] as List<IFormFile>)!;

		bool isAny = _appDbContext.AutoParts
			.AsNoTracking()
			.Any(ap => ap.Id == autoPartId);

		if(!isAny) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The id of the auto-part is not correct.",
					Detail = "An auto-part with the provided id doesn't exist. Data modification is possible. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		await next();
	}
}
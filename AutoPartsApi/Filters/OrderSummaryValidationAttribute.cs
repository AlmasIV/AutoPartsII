using AutoPartsApi.DTOs;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Filters;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class OrderSummaryValidationAttribute : Attribute, IAsyncActionFilter {
	private readonly AppDbContext _appDbContext;
	public OrderSummaryValidationAttribute(AppDbContext appDbContext) {
		_appDbContext = appDbContext;
	}

	// Requesting users must respect the API's various errors. Need to implement it.
	public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
		OrderSummaryModel? orderSummary = context.ActionArguments["orderSummary"] as OrderSummaryModel;

		if (orderSummary is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Required data wasn't present.",
					Detail = "Information about the order wasn't present. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		List<AutoPart>? originalInfo = await _appDbContext.AutoParts
			.Where(ap => orderSummary.OrderedParts.Select(x => x.Id).Contains(ap.Id))
			.ToListAsync();

		if (originalInfo is null || originalInfo.Count() != orderSummary.OrderedParts.Length) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Ordering inexistent auto-parts.",
					Detail = "Some or all of the ordered auto-parts doesn't exist. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		decimal calculatedPrice =
			(from ap in orderSummary.OrderedParts
			 let op = originalInfo.Single(op => op.Id == ap.Id)
			 let price = ap.Amount * op.PriceInKzt
			 select price - ap.Discount).Sum();

		if (orderSummary.TotalPriceInKzt != calculatedPrice) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Price inconsistency.",
					Detail = "Computed price is inconsitent with the provided price. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		AutoPart? temp = null;
		foreach (AutoPart orderedPart in orderSummary.OrderedParts) {
			temp = originalInfo.SingleOrDefault(ap => ap.Id == orderedPart.Id);
			if (!orderedPart.Equals(temp)) {
				context.Result = new ObjectResult(
					new ProblemDetails() {
						Status = StatusCodes.Status400BadRequest,
						Title = "Data inconsistency.",
						Detail = "Requested auto-parts are different from the original one. Contact the devs.",
						Instance = null,
						Type = null
					}
				);
				return;
			}
			else if (temp.Amount < orderedPart.Amount) {
				context.Result = new ObjectResult(
					new ProblemDetails() {
						Status = StatusCodes.Status400BadRequest,
						Title = "Can't order more than we have.",
						Detail = "Ordered more than we have. Contact the devs.",
						Instance = null,
						Type = null
					}
				);
				return;
			}
		}

		await next();
	}
}
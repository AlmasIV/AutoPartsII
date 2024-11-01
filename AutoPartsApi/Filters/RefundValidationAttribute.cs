
using AutoPartsApi.DTOs;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Filters;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class RefundValidationAttribute : Attribute, IAsyncActionFilter {
	private readonly AppDbContext _appDbContext;
	public RefundValidationAttribute(AppDbContext appDbContext) {
		_appDbContext = appDbContext;
	}
	public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
		RefundModel? refund = context.ActionArguments["refundModel"] as RefundModel;

		if (refund is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Detail = "Internal error. Something bad happened. Contact the devs.",
					Instance = "Required data wasn't present.",
					Status = StatusCodes.Status500InternalServerError,
					Title = "Internal error.",
					Type = null
				}
			);
			return;
		}

		Console.WriteLine(
			$"""
				Refund Model Received:
					Auto Part Id: {refund.AutoPartId}
					Order Id: {refund.OrderId}
					Refund Amount: {refund.RefundAmount}
					Refund Money: {refund.RefundMoney}
					Retained Discount: {refund.RetainedDiscount}
			"""
		);

		// Order? order = await _appDbContext.Orders
		// 	.AsNoTracking()
		// 	.Include(o => o.AutoPartsSoldAmounts)
		// 		.ThenInclude(aps => aps.AutoPart)
		// 	.SingleOrDefaultAsync(o => o.Id == refund.OrderId);

		// if (order is null) {
		// 	context.Result = new ObjectResult(
		// 		new ProblemDetails() {
		// 			Detail = "The requested order doesn't exist. Refresh the page and try again.",
		// 			Title = "Data inconsistency.",
		// 			Status = StatusCodes.Status400BadRequest,
		// 			Instance = "Internal error.",
		// 			Type = null
		// 		});
		// 	return;
		// }

		// AutoPartSoldAmount? refundedPart = order!.AutoPartsSoldAmounts
		// 	.SingleOrDefault(ap => ap.AutoPartId == refund.AutoPartId);

		// if (refundedPart is null) {
		// 	context.Result = new ObjectResult(
		// 		new ProblemDetails() {
		// 			Detail = "Requested auto-part wasn't found. Refresh the page and try again.",
		// 			Title = "Auto-part doesn't exist.",
		// 			Status = StatusCodes.Status400BadRequest,
		// 			Instance = "Internal error.",
		// 			Type = null
		// 		});
		// 	return;
		// }

		// if (refund.TotalPrice > order.TotalPriceInKzt || refund.TotalPrice != refundedPart.Price || refund.Discount != refundedPart!.Discount || refund.SoldAmount != refundedPart.SoldAmount) {
		// 	context.Result = new ObjectResult(
		// 		new ProblemDetails() {
		// 			Detail = "Provided data wasn't fresh. Try to refresh the page and try again.",
		// 			Title = "Data inconsistency.",
		// 			Status = StatusCodes.Status400BadRequest,
		// 			Instance = "Internal error.",
		// 			Type = null
		// 		});
		// 	return;
		// }

		// AutoPart? autoPart = refundedPart.AutoPart;

		// if(refund.RefundAmount > refundedPart!.SoldAmount || refund.RefundMoney > refundedPart.Price || autoPart is null || autoPart.PriceInKzt * refund.RefundAmount - refundedPart.Discount != refund.RefundMoney) {
		// 	context.Result = new ObjectResult(
		// 		new ProblemDetails() {
		// 			Detail = "Provided data wasn't fresh. Try to refresh the page and try again.",
		// 			Title = "Data inconsistency.",
		// 			Status = StatusCodes.Status400BadRequest,
		// 			Instance = "Internal error.",
		// 			Type = null
		// 		});
		// 	return;
		// }

		await next();
	}
}
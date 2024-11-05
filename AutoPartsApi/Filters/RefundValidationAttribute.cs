
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
					Status = StatusCodes.Status400BadRequest,
					Title = "Required data wasn't provided.",
					Detail = "Required data wasn't provided. Pre-request modification possible. Refresh the page and try again.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		Console.WriteLine(
			$"""
				In The Filter.
				Refund Model Received:
					Auto Part Id: {refund.AutoPartId}
					Order Id: {refund.OrderId}
					Refund Amount: {refund.RefundAmount}
					Refund Money: {refund.RefundMoney}
					Retained Discount: {refund.RetainedDiscount}
			"""
		);

		Order? order = await _appDbContext.Orders
			.Include(o => o.AutoPartsSoldAmounts
					.Where(aps => aps.AutoPartId == refund.AutoPartId))
				.ThenInclude(aps => aps.AutoPart)
			.SingleOrDefaultAsync(o => o.Id == refund.OrderId);

		if (order is null || order.AutoPartsSoldAmounts.SingleOrDefault() is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Data inconsistency.",
					Detail = "The requested order doesn't exist. Pre-request modification possible. Refresh the page and try again.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		AutoPartSoldAmount autoPartOrderInfo = order.AutoPartsSoldAmounts
			.Single();

		AutoPart? autoPart = autoPartOrderInfo.AutoPart;

		if(autoPart is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Auto-part inexistence.",
					Detail = "The requested auto-part doesn't exist. Pre-request modification is possible. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		if(refund.RefundAmount > autoPartOrderInfo.SoldAmount) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The refunding amount cannot be greater than the sold-amount.",
					Detail = "The refunding amount is greater than the sold-amount. Pre-request modification is possible. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		if(refund.RetainedDiscount > autoPartOrderInfo.Discount) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The retained discount cannot be greater than the overall discount.",
					Detail = "The retained discount is greater than the overall discount. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		if(refund.RefundAmount == 1 && refund.RetainedDiscount != autoPartOrderInfo.Discount) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Retained discount does not match the original discount applied to the item.",
					Detail = "For a full refund, the retained discount must equal the original discount applied at the time of purchase. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
		}

		decimal calculatedRefundMoney = autoPart.PriceInKzt * refund.RefundAmount - refund.RetainedDiscount;

		if(refund.RefundMoney != calculatedRefundMoney) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The calculated refunding money is not equal to the incoming value.",
					Detail = "The calculated refunding money is not equal to the incoming value. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		await next();
	}
}
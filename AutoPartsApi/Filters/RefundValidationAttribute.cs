
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
		// Improve validation more.
		RefundModel? refund = context.ActionArguments["refundModel"] as RefundModel;

		if (refund is null) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Required data wasn't provided.",
					Detail = "Required data wasn't provided. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

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
					Detail = "The requested order doesn't exist. Contact the devs.",
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
					Detail = "The requested auto-part doesn't exist. Contact the devs.",
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
					Detail = "The refunding amount is greater than the sold-amount.  Contact the devs.",
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

		if(refund.RefundAmount == autoPartOrderInfo.SoldAmount && refund.RetainedDiscount != autoPartOrderInfo.Discount) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Retained discount does not match the original discount applied to the item(s).",
					Detail = "For a full refund, the retained discount must be equal the original discount applied at the time of purchase. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		if(refund.RefundMoney > autoPartOrderInfo.Price) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "Refund money cannot be greater than the overall price.",
					Detail = "Refund money cannot exceed the total price. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		decimal calculatedRefundMoney = autoPart.PriceInKzt * refund.RefundAmount - refund.RetainedDiscount;


		if(refund.RefundMoney != calculatedRefundMoney) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The calculated refund money is not equal to the incoming value.",
					Detail = "The calculated refund money is not equal to the incoming value. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		if(calculatedRefundMoney < 0) {
			context.Result = new ObjectResult(
				new ProblemDetails() {
					Status = StatusCodes.Status400BadRequest,
					Title = "The refund money cannot be negative.",
					Detail = "The refund money was negative. Contact the devs.",
					Instance = null,
					Type = null
				}
			);
			return;
		}

		await next();
	}
}
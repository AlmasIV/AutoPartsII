using AutoPartsApi.DTOs;
using AutoPartsApi.Filters;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Route("orders")]
[Authorize("Bearer")]
public class OrdersController : ControllerBase {
	private readonly AppDbContext _appDbContext;
	public OrdersController(AppDbContext appDbContext, ProblemDetailsFactory problemDetailsFactory) {
		_appDbContext = appDbContext;
	}

	[HttpGet()]
	[Route("pages/{page:int:range(1, 1000)}")]
	public async Task<IEnumerable<ClientOrderModel>> GetOrders(int page) {
		int contentCount = 100;
		return await _appDbContext.Orders
			.AsNoTracking()
			.Select(o => o)
			.OrderByDescending(o => o.CreatedOn)
			.Skip(page * contentCount - contentCount)
			.Take(contentCount)
			.Select(o => new ClientOrderModel(o))
			.ToArrayAsync();
	}

	[HttpGet()]
	[Route("count")]
	public async Task<int> OrdersCount() {
		return await _appDbContext.Orders
			.CountAsync();
	}

	[HttpGet()]
	[Route("{id:int:min(1)}")]
	public async Task<Object> GetOrder(int id) {
		var result = await _appDbContext.Orders
			.Where(order => order.Id == id)
			.Include(order => order.AutoPartsSoldAmounts)
				.ThenInclude(sa => sa.AutoPart)
			.Select(o => new {
				id = o.Id,
				totalPriceInKzt = o.TotalPriceInKzt,
				soldParts = o.AutoPartsSoldAmounts.Select(sa => new {
					soldPart = sa.AutoPart,
					soldAmount = sa.SoldAmount,
					price = sa.Price,
					discount = sa.Discount
				}).ToArray()
			})
			.SingleOrDefaultAsync();

		if (result is null) {
			return BadRequest(new ProblemDetails() {
				Status = StatusCodes.Status400BadRequest,
				Title = "Requesting inexistent order.",
				Detail = "The requested resource wasn't found. Contact the devs.",
				Instance = null,
				Type = null
			});
		}
		return result;
	}

	[HttpPost()]
	[Route("refund")]
	[TypeFilter(typeof(RefundValidationAttribute))]
	public async Task<IActionResult> RefundAutoPart(RefundModel refundModel) {
		Console.WriteLine(
			$"""
				In The Controller.
				Refund Model Received:
					Auto Part Id: {refundModel.AutoPartId}
					Order Id: {refundModel.OrderId}
					Refund Amount: {refundModel.RefundAmount}
					Refund Money: {refundModel.RefundMoney}
					Retained Discount: {refundModel.RetainedDiscount}
			"""
		);
		Order order = await _appDbContext.Orders
			.Include(o => o.AutoPartsSoldAmounts
					.Where(aps => aps.AutoPartId == refundModel.AutoPartId))
				.ThenInclude(aps => aps.AutoPart)
			.SingleAsync(o => o.Id == refundModel.OrderId);

		AutoPartSoldAmount autoPartOrderInfo = order.AutoPartsSoldAmounts
				.Single();

		if (order.TotalPriceInKzt - refundModel.RefundMoney == 0) {
			_appDbContext.Orders.Remove(order);
		}
		else {
			if (autoPartOrderInfo.SoldAmount - refundModel.RefundAmount == 0) {
				order.AutoPartsSoldAmounts.Remove(autoPartOrderInfo);
			}
			else {
				autoPartOrderInfo.SoldAmount -= refundModel.RefundAmount;
				autoPartOrderInfo.Price -= refundModel.RefundMoney;
				autoPartOrderInfo.Discount -= refundModel.RetainedDiscount;
			}
			order.TotalPriceInKzt -= refundModel.RefundMoney;
		}
		autoPartOrderInfo.AutoPart.Amount += refundModel.RefundAmount;
		await _appDbContext.SaveChangesAsync();

		return Ok();
	}
}
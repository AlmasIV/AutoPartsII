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
	[Route("pages/{page:int}")]
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
	[Route("{id:int}")]
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
				Type = null,
				Status = StatusCodes.Status400BadRequest,
				Title = "Not found.",
				Detail = "The requested resource wasn't found. Possibly removed from the database.",
				Instance = null
			});
		}
		return result;
	}

	[HttpPost()]
	[Route("refund")]
	[TypeFilter(typeof(RefundValidationAttribute))]
	public async Task<IActionResult> RefundAutoPart(RefundModel refundModel) {
		Order order = await _appDbContext.Orders
			.Include(o => o.AutoPartsSoldAmounts)
				.ThenInclude(aps => aps.AutoPart)
			.Where(o => o.Id == refundModel.OrderId)
			.SingleAsync();

		if (order.TotalPriceInKzt - refundModel.RefundMoney == 0) {
			_appDbContext.Orders.Remove(order);
		}
		else {
			AutoPartSoldAmount autoPart = order.AutoPartsSoldAmounts
				.Where(ap => ap.AutoPartId == refundModel.AutoPartId)
				.Single();

			if (autoPart.SoldAmount - refundModel.RefundAmount == 0) {
				order.AutoPartsSoldAmounts.Remove(autoPart);
			}
			else {
				autoPart.SoldAmount -= refundModel.RefundAmount;
				autoPart.Price -= refundModel.RefundMoney;
				autoPart.AutoPart.Amount += refundModel.RefundAmount;
			}
		}


		// Console.WriteLine("Refund Model:");
		// Console.WriteLine($"Discount Percentage: {refundModel.Discount}");
		// Console.WriteLine($"Auto Part Id: {refundModel.AutoPartId}");
		// Console.WriteLine($"Order Id: {refundModel.OrderId}");
		// Console.WriteLine($"Refund Amount: {refundModel.RefundAmount}");
		// Console.WriteLine($"Refund Money: {refundModel.RefundMoney}");
		// Console.WriteLine($"Sold Amount: {refundModel.SoldAmount}");
		// Console.WriteLine($"Total Price: {refundModel.TotalPrice}");
		return Ok();
	}
}
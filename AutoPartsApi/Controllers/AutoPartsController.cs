using AutoPartsApi.DTOs;
using AutoPartsApi.Filters;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Route("auto-parts")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class AutoPartController : ControllerBase
{
	private readonly AppDbContext _appDbContext;
	public AutoPartController(AppDbContext appDbContext)
	{
		_appDbContext = appDbContext;
	}

	[HttpGet()]
	[Route("{page:int}")]
	public async Task<IEnumerable<AutoPart>> GetPage(int page)
	{
		int contentCount = 100;
		return await _appDbContext.AutoParts
			.AsNoTracking()
			.Select(ap => ap)
			.OrderBy(ap => ap.Id)
			.Skip(page * contentCount - contentCount)
			.Take(contentCount)
			.ToArrayAsync();
	}

	[HttpGet()]
	[Route("count")]
	public async Task<int> Count()
	{
		return await _appDbContext.AutoParts
			.CountAsync();
	}

	[HttpPost()]
	[Route("create")]
	public async Task<IActionResult> Create([FromBody] AutoPart autoPart)
	{
		await _appDbContext.AutoParts.AddAsync(autoPart);
		await _appDbContext.SaveChangesAsync();
		return Ok(autoPart);
	}

	[HttpPost()]
	[Route("sell")]
	[TypeFilter(typeof(OrderSummaryValidationAttribute))]
	public async Task<IActionResult> Sell([FromBody] OrderSummaryModel orderSummary)
	{
		Order order = new Order()
		{
			TotalPriceInKzt = orderSummary.TotalPriceInKzt,
			AutoPartsSoldAmounts = new List<AutoPartSoldAmount>()
		};
		foreach (AutoPart autoPart in orderSummary.OrderedParts)
		{
			order.AutoPartsSoldAmounts.Add(new AutoPartSoldAmount()
			{
				AutoPartId = autoPart.Id,
				SoldAmount = autoPart.Amount
			});
		}

		AutoPart[] parts = await _appDbContext.AutoParts
			.Where(ap => orderSummary.OrderedParts.Select(op => op.Id).Contains(ap.Id))
			.Select(ap => ap)
			.ToArrayAsync();
		foreach (AutoPart autoPart in parts)
		{
			autoPart.Amount -= orderSummary.OrderedParts
				.Where(ap => ap.Id == autoPart.Id)
				.First().Amount;
		}

		await _appDbContext.Orders.AddAsync(order);
		await _appDbContext.SaveChangesAsync();

		return Ok();
	}
}
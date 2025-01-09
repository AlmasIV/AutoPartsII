using System.Text;

using AutoPartsApi.DTOs;
using AutoPartsApi.Filters;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Route("auto-parts")]
[Authorize("Bearer")]
public class AutoPartsController : ControllerBase {
	private readonly AppDbContext _appDbContext;
	public AutoPartsController(AppDbContext appDbContext) {
		_appDbContext = appDbContext;
	}

	[HttpGet()]
	[Route("page/{page:int:range(1, 1000)}")]
	public async Task<IEnumerable<AutoPart>> GetPage(int page) {
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
	public async Task<int> Count() {
		return await _appDbContext.AutoParts
			.CountAsync();
	}

	[HttpGet()]
	[Route("{id:int:min(1)}")]
	public async Task GetAutoPartImages(int id) {
		bool isAnyImage = await _appDbContext.Images
			.Where(i => i.AutoPartId == id)
			.AnyAsync();
		
		if(!isAnyImage) {
			Response.StatusCode = StatusCodes.Status204NoContent;
			return;
		}

		Response.ContentType = "application/octet-stream";

		IAsyncEnumerable<Image> images = _appDbContext.Images
			.AsNoTracking()
			.Where(i => i.AutoPartId == id)
			.AsAsyncEnumerable();

		await foreach(Image image in images) {
			byte[] headerBytes = Encoding.UTF8.GetBytes($"{image.Title + "-" + image.Id}\n");
			await Response.Body.WriteAsync(headerBytes, 0, headerBytes.Length);
			await Response.Body.WriteAsync(image.Data, 0, image.Data.Length);
		}
	}

	[HttpPost()]
	[Route("create")]
	public async Task<IActionResult> Create([FromForm] AutoPart autoPart, [FromForm] List<IFormFile> images) {
		// Implement a hash comparison to compare files. Should I forbid duplicates?
		List<Image> autoPartImages = new List<Image>();
		Image? image = null;
		foreach (IFormFile file in images) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				await file.CopyToAsync(memoryStream);
				image = new Image() {
					Title = Path.GetFileName(file.FileName),
					Data = memoryStream.ToArray(),
					ContentType = file.ContentType
				};
				autoPartImages.Add(image);
			}
		}
		autoPart.Images = autoPartImages;
		await _appDbContext.AutoParts.AddAsync(autoPart);
		await _appDbContext.SaveChangesAsync();
		return Ok(autoPart);
	}

	[HttpPut()]
	[Route("update/{id:int:min(1)}")]
	public async Task<IActionResult> Update([FromRoute] int id, [FromForm] AutoPart updatedAutoPart, [FromForm] List<IFormFile> images) {
		
		throw new NotImplementedException();
	}

	[HttpPost()]
	[Route("sell")]
	[TypeFilter(typeof(OrderSummaryValidationAttribute))]
	public async Task<IActionResult> Sell([FromBody] OrderSummaryModel orderSummary) {
		Order order = new Order() {
			TotalPriceInKzt = orderSummary.TotalPriceInKzt,
			AutoPartsSoldAmounts = new List<AutoPartSoldAmount>()
		};
		foreach (AutoPart autoPart in orderSummary.OrderedParts) {
			order.AutoPartsSoldAmounts.Add(new AutoPartSoldAmount() {
				AutoPartId = autoPart.Id,
				SoldAmount = autoPart.Amount,
				Discount = autoPart.Discount,
				Price = autoPart.PriceInKzt * autoPart.Amount - autoPart.Discount
			});
		}

		AutoPart[] parts = await _appDbContext.AutoParts
			.Where(ap => orderSummary.OrderedParts.Select(op => op.Id).Contains(ap.Id))
			.Select(ap => ap)
			.ToArrayAsync();
		foreach (AutoPart autoPart in parts) {
			autoPart.Amount -= orderSummary.OrderedParts
				.Where(ap => ap.Id == autoPart.Id)
				.First().Amount;
		}

		await _appDbContext.Orders.AddAsync(order);
		await _appDbContext.SaveChangesAsync();

		return Ok(new ClientOrderModel(order));
	}
}
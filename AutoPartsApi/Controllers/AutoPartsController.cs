using AutoPartsApi.DTOs;
using AutoPartsApi.Filters;
using AutoPartsApi.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.IO.Compression;

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
	[Route("page/{page:int}")]
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
	[Route("{id:int}")]
	public async Task<IActionResult> GetAutoPartImages(int id) {
		/*
			1) Implement memroy streaming, don't hold images in the memory.
			2) Improve error-recoverability.
		*/
		IEnumerable<Image>? images = _appDbContext.Images
			.AsNoTracking()
			.Where(im => im.AutoPartId == id)
			.Select(im => im);
		if (images is null) {
			return NotFound();
		}
		using (MemoryStream memoryStream = new MemoryStream()) {
			using (ZipArchive archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true)) {
				foreach (Image image in images) {
					ZipArchiveEntry entry = archive.CreateEntry(image.Title, CompressionLevel.Fastest);
					using (Stream entryStream = entry.Open()) {
						await entryStream.WriteAsync(image.Data, 0, image.Data.Length);
					}
				}
			}
			return File(memoryStream.ToArray(), "application/zip", "images/zip");
		}
	}

	[HttpPost()]
	[Route("create")]
	public async Task<IActionResult> Create([FromForm] AutoPart autoPart, [FromForm] List<IFormFile> images) {
		/*
			1) Compress images, if so then I also need to decompress them.
			2) Sanitize file names, and add GUIDs to file names.
			3) Check files with anti-virus systems.
		*/
		List<Image> autoPartImages = new List<Image>();
		Image? image = null;
		foreach (IFormFile file in images) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				await file.CopyToAsync(memoryStream);
				image = new Image() {
					Title = file.FileName,
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

	[HttpPost()]
	[Route("sell")]
	[TypeFilter(typeof(OrderSummaryValidationAttribute))]
	public async Task<IActionResult> Sell([FromBody] OrderSummaryModel orderSummary) {
		Order order = new Order() {
			TotalPriceInKzt = orderSummary.TotalPriceInKzt,
			AutoPartsSoldAmounts = new List<AutoPartSoldAmount>()
		};
		foreach (AutoPart autoPart in orderSummary.OrderedParts) {
			decimal discount = autoPart.PriceInKzt * (autoPart.DiscountPercentage ?? 0) / 100;
			order.AutoPartsSoldAmounts.Add(new AutoPartSoldAmount() {
				AutoPartId = autoPart.Id,
				SoldAmount = autoPart.Amount,
				DiscountPercentage = autoPart.DiscountPercentage,
				Price = autoPart.PriceInKzt * autoPart.Amount - discount
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
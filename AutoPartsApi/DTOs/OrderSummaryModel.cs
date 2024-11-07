using System.ComponentModel.DataAnnotations;

using AutoPartsApi.Models;

namespace AutoPartsApi.DTOs;

public class OrderSummaryModel {
	[Required()]
	[MinLength(1)]
	public AutoPart[] OrderedParts { get; set; } = null!;

	[Required()]
	[Range(0, 9999_9999.99)]
	public decimal TotalPriceInKzt { get; set; }
}
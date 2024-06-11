using AutoPartsApi.Models;
using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class OrderSummaryModel {
    [Required()]
    [MinLength(1)]
    public AutoPart[] OrderedParts { get; set; } = null!;

    [Required()]
    [Range(100, 9999_9999.99)]
    public decimal TotalPriceInKzt { get; set; }
}
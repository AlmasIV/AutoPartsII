using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using AutoPartsApi.Models;

namespace AutoPartsApi.DTOs;

public class OrderSummary {
    [Required()]
    [MinLength(1)]
    [JsonPropertyName("orderedParts")]
    public AutoPart[] OrderedParts { get; set; } = null!;

    [Required()]
    [Range(100, 9999_9999.99)]
    [JsonPropertyName("totalPriceInKzt")]
    public decimal TotalPriceInKzt { get; set; }
}
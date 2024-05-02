using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;
public class AutoPart {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required(), MinLength(3)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [Required(), MinLength(3)]
    [JsonPropertyName("applicability")]
    public string Applicability { get; set; } = null!;

    [JsonPropertyName("company")]
    public string? Company { get; set; }

    [Range(0, 9999_9999.99)]
    [JsonPropertyName("priceInRub")]
    [Column(TypeName = "decimal(10, 2)")]
    public decimal PriceInRub { get; set; }

    [Required(), Range(0, 9999_9999.99)]
    [JsonPropertyName("priceInKzt")]
    [Column(TypeName = "decimal(10, 2)")]
    public decimal PriceInKzt { get; set; }

    [Required(), Range(1, ushort.MaxValue)]
    [JsonPropertyName("amount")]
    public ushort Amount { get; set; }
}
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPartsApi.Models;

public class Order {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required()]
    [JsonPropertyName("autoParts")]
    public List<AutoPart> AutoParts { get; set; } = null!;

    [Required()]
    [Range(100, 9999_9999.99)]
    [Column(TypeName = "decimal(10, 2)")]
    [JsonPropertyName("totalPriceInKzt")]
    public decimal TotalPriceInKzt { get; set; }

    [Required()]
    [JsonIgnore()]
    public List<AutoPartSoldAmount> AutoPartsSoldAmounts { get; set; } = null!;

    [Required()]
    [JsonPropertyName("createdOn")]
    [Column(TypeName = "datetime2(0)")]
    public DateTime CreatedOn { get; set; }
}
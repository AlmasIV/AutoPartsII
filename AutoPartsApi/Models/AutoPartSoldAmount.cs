using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class AutoPartSoldAmount {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("autoPartId")]
    public int AutoPartId { get; set; }

    [Required()]
    [JsonIgnore()]
    public AutoPart AutoPart { get; set; } = null!;

    [Range(1, int.MaxValue)]
    [JsonPropertyName("soldAmount")]
    public int SoldAmount { get; set; }
}
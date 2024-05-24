using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.Models;

public class AutoPartSoldAmount {
    public int Id { get; set; }

    public int AutoPartId { get; set; }

    [Required()]
    [JsonIgnore()]
    public AutoPart AutoPart { get; set; } = null!;

    [Range(1, int.MaxValue)]
    public int SoldAmount { get; set; }
}
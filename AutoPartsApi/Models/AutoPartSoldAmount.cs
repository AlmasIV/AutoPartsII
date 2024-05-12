using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class AutoPartSoldAmount {
    [
        JsonPropertyName("id")
    ]
    public int Id { get; set; }

    [
        JsonPropertyName("autoPartId")
    ]
    public int AutoPartId { get; set; }

    [
        JsonIgnore,
        Required()
    ]
    public AutoPart AutoPart { get; set; } = null!;

    [
        JsonPropertyName("soldAmount"),
        Range(1, int.MaxValue)
    ]
    public int SoldAmount { get; set; }
}
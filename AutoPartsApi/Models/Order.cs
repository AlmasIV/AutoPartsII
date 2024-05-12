using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class Order {
    [
        JsonPropertyName("id")
    ]
    public int Id { get; set; }

    [
        Required(),
        JsonPropertyName("autoParts")
    ]
    public List<AutoPart> AutoParts { get; set; } = null!;

    [
        Required(),
        Column(TypeName = "decimal(10, 2)"),
        JsonPropertyName("totalPriceInKzt"),
        Range(100, 9999_9999.99)
    ]
    public decimal TotalPriceInKzt { get; set; }

    [
        Required(),
        JsonIgnore()
    ]
    public List<AutoPartSoldAmount> AutoPartsSoldAmounts { get; set; } = null!;

    [
        JsonPropertyName("createdOn"),
        Column(TypeName = "datetime2(0)"),
        Required()
    ]
    public DateTime CreatedOn { get; set; }
}
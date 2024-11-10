using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class Order {
	public int Id { get; set; }

	[Required()]
	[Column(TypeName = "decimal(10, 2)")]
	public decimal TotalPriceInKzt { get; set; }

	[Required()]
	[JsonIgnore()]
	public List<AutoPartSoldAmount> AutoPartsSoldAmounts { get; set; } = null!;

	[Required()]
	[Column(TypeName = "datetime2(0)")]
	public DateTime CreatedOn { get; set; }
}
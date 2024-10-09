using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

/*
	1) Maybe I should remove serialization attributes, cause I think that this entity is not used in serialization and deserialization?
*/
public class AutoPartSoldAmount {
	public int Id { get; set; }

	[Required()]
	public int AutoPartId { get; set; }

	[Required()]
	[JsonIgnore()]
	public AutoPart AutoPart { get; set; } = null!;

	[Range(1, ushort.MaxValue)]
	public ushort SoldAmount { get; set; }

	[Range(0, 9999_9999.99)]
	[Column(TypeName = "decimal(10, 2)")]
	public decimal Discount { get; set; }

	[Column(TypeName = "decimal(10, 2)")]
	public decimal Price { get; set; }
}
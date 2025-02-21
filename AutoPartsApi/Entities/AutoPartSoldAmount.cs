using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoPartsApi.Models;
public class AutoPartSoldAmount {
	public Guid Id { get; set; }

	[Required()]
	public Guid AutoPartId { get; set; }

	[Required()]
	public AutoPart AutoPart { get; set; } = null!;

	[Required()]
	public Guid OrderId { get; set; }

	[Required()]
	public Order Order { get; set; } = null!;

	[Range(1, ushort.MaxValue)]
	public ushort SoldAmount { get; set; }

	[Range(0, 9999_9999.99)]
	[Column(TypeName = "decimal(10, 2)")]
	public decimal Discount { get; set; }

	[Column(TypeName = "decimal(10, 2)")]
	public decimal Price { get; set; }
}
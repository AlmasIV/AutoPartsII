using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class RefundModel {
	[Required()]
	public int OrderId { get; set; }

	[Required()]
	public int AutoPartId { get; set; }

	[Required()]
	[Range(1, ushort.MaxValue)]
	public ushort RefundAmount { get; set; }

	[Required()]
	[Range(0, 9999_9999.99)]
	public decimal RefundMoney { get; set; }

	[Required()]
	[Range(0, 9999_9999.99)]
	public decimal RetainedDiscount { get; set; }
}
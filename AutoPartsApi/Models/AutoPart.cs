using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;
public class AutoPart : IEquatable<AutoPart> {
	public Guid Id { get; set; }

	[Required()]
	[MinLength(3)]
	public string Name { get; set; } = null!;

	[Required()]
	[MinLength(3)]
	public string Applicability { get; set; } = null!;

	public string? Company { get; set; }

	[Required()]
	[Range(100, 9999_9999.99)]
	[Column(TypeName = "decimal(10, 2)")]
	public decimal PriceInKzt { get; set; }

	[Required()]
	[Range(1, ushort.MaxValue)]
	public ushort Amount { get; set; }

	public string? Notes { get; set; }

	[Range(0, 9999_9999.99)]
	[Column(TypeName = "decimal(10, 2)")]
	public decimal Discount { get; set; }

	[JsonIgnore()]
	public List<Image>? Images { get; set; }

	public bool Equals(AutoPart? other) {
		if (other is null) {
			return false;
		}

		return (
			Id == other.Id &&
			Name == other.Name &&
			Applicability == other.Applicability &&
			Company == other.Company &&
			PriceInKzt == other.PriceInKzt
		);
	}

	public override bool Equals(object? obj) {
		return Equals(obj as AutoPart);
	}

	public override int GetHashCode() {
		return HashCode.Combine(Id, Name, Applicability, Company, PriceInKzt);
	}
}
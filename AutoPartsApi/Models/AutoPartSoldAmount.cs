using System.ComponentModel.DataAnnotations;
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

	[Range(1, int.MaxValue)]
	public int SoldAmount { get; set; }
}
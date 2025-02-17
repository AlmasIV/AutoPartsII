using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class Image {
	public Guid Id { get; set; }
	public string Title { get; set; } = null!;
	public byte[] Data { get; set; } = null!;
	public string ContentType { get; set; } = null!;

	[Required()]
	[JsonIgnore()]
	public Guid AutoPartId { get; set; }

	[Required()]
	[JsonIgnore()]
	public AutoPart AutoPart { get; set; } = null!;
}
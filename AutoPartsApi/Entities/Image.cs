using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AutoPartsApi.Models;

public class Image {
	public Guid Id { get; set; }

	[Required()]
	public string Title { get; set; } = null!;

	[Required()]
	public byte[] Data { get; set; } = null!;

	[Required()]
	public string ContentType { get; set; } = null!;

	[Required()]
	public string Hash { get; set; } = null!;

	[Required()]
	public Guid AutoPartId { get; set; }

	[Required()]
	public AutoPart AutoPart { get; set; } = null!;
}
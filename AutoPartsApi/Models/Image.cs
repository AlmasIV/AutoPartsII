using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.Models;

public class Image {
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public byte[] Data { get; set; } = null!;
    public string ContentType { get; set; } = null!;

    [JsonIgnore()]
    public int AutoPartId { get; set; }

    [Required()]
    [JsonIgnore()]
    public AutoPart AutoPart { get; set; } = null!;
}
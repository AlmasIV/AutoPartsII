using AutoPartsApi.Models;
using System.ComponentModel.DataAnnotations;

namespace AutoPartsApi.DTOs;

public class AutoPartModel {
    [Required()]
    public AutoPart AutoPart { get; set; } = null!;
    public List<IFormFile>? Images { get; set; }
}
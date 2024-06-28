using System.ComponentModel.DataAnnotations;

using AutoPartsApi.Models;

namespace AutoPartsApi.DTOs;

public class AutoPartModel
{
	[Required()]
	public AutoPart AutoPart { get; set; } = null!;
	public List<IFormFile>? Images { get; set; }
}
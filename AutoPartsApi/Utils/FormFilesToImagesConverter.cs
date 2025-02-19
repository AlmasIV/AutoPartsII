using AutoPartsApi.Models;

namespace AutoPartsApi.Utils;

public static class FormFilesToImagesConverter {
	public async static Task<List<Image>> Convert(List<IFormFile> formFiles) {
		List<Image> result = new List<Image>();
		foreach (IFormFile file in formFiles) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				await file.CopyToAsync(memoryStream);
				Image image = new Image() {
					Title = Path.GetFileName(file.FileName),
					Data = memoryStream.ToArray(),
					ContentType = file.ContentType,
					Hash = await StreamHasher.ComputeHash(memoryStream)
				};
				result.Add(image);
			}
		}
		return result;
	}
}
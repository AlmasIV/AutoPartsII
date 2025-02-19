using System.Security.Cryptography;
using System.Text;

namespace AutoPartsApi.Utils;

public static class StreamHasher {
	public async static Task<string> ComputeHashAsync(Stream stream) {
		using (SHA256 sha256 = SHA256.Create()) {
			byte[] hashBytes = await sha256.ComputeHashAsync(stream);
			StringBuilder builder = new StringBuilder();
			for (int i = 0; i < hashBytes.Length; i++) {
				builder.Append(hashBytes[i].ToString("x2"));
			}
			return builder.ToString();
		}
	}
}
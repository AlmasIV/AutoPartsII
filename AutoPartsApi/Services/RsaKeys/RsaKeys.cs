using System.Collections.Immutable;
using System.Security.Cryptography;

namespace AutoPartsApi.Services;

public class JwtRsaKeys {
	private readonly object _lock = new();
	private readonly LinkedList<RsaKey> _keyCache = new();
	private readonly ILogger<JwtRsaKeys> _logger;
	public JwtRsaKeys(ILogger<JwtRsaKeys> logger) {
		_logger = logger;
	}
	public IReadOnlyCollection<RsaKey> ValidKeys {
		get {
			_logger.LogInformation("Returning Valid Keys.");
			lock (_lock) {
				return _keyCache.Select(kp => kp.Clone()).ToImmutableArray();
			}
		}
	}
	public void RotateKeys(string keyId, RSAParameters rsaParameters) {
		_logger.LogInformation($"Rotate keys with the key id {keyId}.");
		RsaKey newPair = new RsaKey(keyId, rsaParameters);
		lock (_lock) {
			_keyCache.AddFirst(newPair);
			if (_keyCache.Count > 2) {
				_keyCache.RemoveLast();
			}
		}
	}

	public class RsaKey {
		public string KeyId { get; }
		public RSAParameters Parameters { get; }

		public RsaKey(string keyId, RSAParameters rsaParameters) {
			KeyId = keyId;
			Parameters = rsaParameters;
		}

		public RsaKey Clone() {
			return new RsaKey(KeyId, Parameters);
		}
	}
}
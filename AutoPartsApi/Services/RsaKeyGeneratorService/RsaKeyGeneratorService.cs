using System.Security.Cryptography;

namespace AutoPartsApi.Services;

public class RsaKeyGeneratorService : BackgroundService {
	private static DateTime? _lastExecutionTime;
	private static readonly TimeSpan _interval = TimeSpan.FromHours(24);
	private readonly ILogger<RsaKeyGeneratorService> _logger;
	private readonly JwtRsaKeys _jwtRsaKeys;
	public RsaKeyGeneratorService(ILogger<RsaKeyGeneratorService> logger, JwtRsaKeys jwtRsaKeys) {
		_logger = logger;
		_jwtRsaKeys = jwtRsaKeys;
	}
	protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
		_logger.LogInformation($"{nameof(RsaKeyGeneratorService)} is starting.");
		using PeriodicTimer periodicTimer = new(_interval);
		try {
			do {
				GenerateKeysIfDue();
			} while (stoppingToken.IsCancellationRequested is false && await periodicTimer.WaitForNextTickAsync(stoppingToken));
		}
		catch (OperationCanceledException) {
			_logger.LogInformation($"{nameof(RsaKeyGeneratorService)} is stopping due to cancellation.");
		}
		catch (Exception ex) {
			_logger.LogError(ex, $"{nameof(RsaKeyGeneratorService)} is stopping due to an unexpected exception.");
		}
		finally {
			_logger.LogInformation($"{nameof(RsaKeyGeneratorService)} has stopped.");
		}
	}
	private void GenerateKeysIfDue() {
		DateTime currentTime = DateTime.UtcNow;
		if (_lastExecutionTime is null || currentTime - _lastExecutionTime >= _interval) {
			_logger.LogInformation("Starting RSA key generation.");
			try {
				using (RSA rsa = RSA.Create(2048)) {
					_jwtRsaKeys.RotateKeys(Guid.NewGuid().ToString(), rsa.ExportParameters(true));
				}
				_lastExecutionTime = currentTime;
				_logger.LogInformation("RSA key generation completed successfully.");
			}
			catch (Exception ex) {
				_logger.LogError(ex, "An unexpected exception has happened during RSA key generation.");
			}
		}
		else {
			_logger.LogInformation($"RSA key generation is not due yet. Last run was at {_lastExecutionTime}.");
		}
	}
}
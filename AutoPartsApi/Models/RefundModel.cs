namespace AutoPartsApi.Models;

public class RefundModel {
	public int AutoPartSoldAmountId { get; set; }
	public int AutoPartId { get; set; }
	public int Amount { get; set; }
}
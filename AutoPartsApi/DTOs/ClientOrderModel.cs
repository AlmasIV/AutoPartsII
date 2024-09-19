using AutoPartsApi.Models;

namespace AutoPartsApi.DTOs;

public class ClientOrderModel {
	public int Id { get; init; }
	public DateTime CreatedOn { get; init; }
	public decimal TotalPriceInKzt { get; init; }
	public ClientOrderModel(Order order) {
		Id = order.Id;
		CreatedOn = order.CreatedOn;
		TotalPriceInKzt = order.TotalPriceInKzt;
	}
}
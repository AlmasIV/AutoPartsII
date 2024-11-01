export function calculateInitialRetainedDiscount(refundingAmount, soldPartDetails) {
	return (soldPartDetails.discount / soldPartDetails.soldAmount) * refundingAmount;
}
import { NumberController } from "@/app/components/Index.js";
import { saveAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";

export default function DiscountApplier(
	{
		selectedAutoParts,
		setSelectedAutoParts,
		selectedAutoPart
	}
) {
	function updateDiscount(newDiscount) {
		if(newDiscount > selectedAutoPart.priceInKzt * selectedAutoPart.selectedAmount) {
			newDiscount = selectedAutoPart.priceInKzt * selectedAutoPart.selectedAmount;
		}
		else if(newDiscount < 0) {
			newDiscount = 0;
		}
		const autoPart = {
			...selectedAutoPart,
			discount: newDiscount
		};
		saveAutoPart(autoPart);
		setSelectedAutoParts(
			[
				...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
			]
		);
	}

	return (
		<NumberController
			updater={updateDiscount}
			step={100}
			value={selectedAutoPart.discount}
		/>
	);
}
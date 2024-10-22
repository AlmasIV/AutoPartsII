import { NumberController } from "@/app/components/Index.js";
import { saveAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";

export default function DiscountApplier(
	{
		selectedAutoParts,
		setSelectedAutoParts,
		selectedAutoPart
	}
) {

	function updateNumber(discount) {
		if(discount > selectedAutoPart.priceInKzt) {
			discount = selectedAutoPart.priceInKzt;
		}
		else if(discount < 0) {
			discount = 0;
		}
		const autoPart = {
			...selectedAutoPart,
			discount: discount
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
			updater={updateNumber}
			step={100}
			value={selectedAutoPart.discount}
		/>
	);
}
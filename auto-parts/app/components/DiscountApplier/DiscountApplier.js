import { NumberController } from "@/app/components/Index.js";
import { saveAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";

export default function DiscountApplier(
	{
		selectedAutoParts,
		setSelectedAutoParts,
		selectedAutoPart
	}
) {
	function onIncrement() {
		if(selectedAutoPart.discount <= selectedAutoPart.priceInKzt) {
			const autoPart = {
				...selectedAutoPart,
				discount: selectedAutoPart.discount + 100 > selectedAutoPart.priceInKzt ? selectedAutoPart.priceInKzt : selectedAutoPart.discount + 100
			};
			saveAutoPart(autoPart);
			setSelectedAutoParts(
				[
					...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
				]
			);
		}
	}

	function onDecrement() {
		if(selectedAutoPart.discount >= 1) {
			const autoPart = {
				...selectedAutoPart,
				discount: selectedAutoPart.discount - 100 < 0 ? 0 : selectedAutoPart.discount - 100
			};
			saveAutoPart(autoPart);
			setSelectedAutoParts(
				[
					...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
				]
			);
		}
	}

	return (
		<NumberController
			onIncrement={onIncrement}
			onDecrement={onDecrement}
			value={selectedAutoPart.discount}
		/>
	);
}
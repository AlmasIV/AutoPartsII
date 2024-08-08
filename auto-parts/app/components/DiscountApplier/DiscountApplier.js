import { NumberController } from "@/app/components/Index.js";
import { setAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";

export default function DiscountApplier(
	{
		selectedAutoParts,
		setSelectedAutoParts,
		selectedAutoPart
	}
) {
	function onIncrement() {
		if(selectedAutoPart.discountPercentage <= 100) {
			const autoPart = {
				...selectedAutoPart,
				discountPercentage: selectedAutoPart.discountPercentage + 1
			};
			setAutoPart(autoPart);
			setSelectedAutoParts(
				[
					...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
				]
			);
		}
	}

	function onDecrement() {
		if(selectedAutoPart.discountPercentage >= 1) {
			const autoPart = {
				...selectedAutoPart,
				discountPercentage: selectedAutoPart.discountPercentage - 1
			};
			setAutoPart(autoPart);
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
			value={selectedAutoPart.discountPercentage}
			valuePostFix="%"
		/>
	);
}
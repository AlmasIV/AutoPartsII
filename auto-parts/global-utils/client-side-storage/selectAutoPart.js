import saveAutoPart from "@/global-utils/client-side-storage/saveAutoPart.js";
import notify from "@/global-utils/notifications/notify.js";

export default function selectAutoPart(autoPart, selectedState, globalNotification) {
	autoPart = {
		...autoPart,
		amount: autoPart.amount - 1,
		selectedAmount: 1,
		discount: 0
	};
	saveAutoPart(autoPart);
	const sortedArray = [...selectedState.selectedAutoParts, autoPart].sort((a, b) => a.id - b.id);
	selectedState.setSelectedAutoParts(
		[...sortedArray]
	);
	notify(globalNotification, `Added to shopping cart: ${autoPart.name}.`);
}
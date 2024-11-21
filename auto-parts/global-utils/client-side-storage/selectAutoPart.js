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
	selectedState.setSelectedAutoParts((prevSelectedAutoParts) => prevSelectedAutoParts.map((ap) => ap.id === autoPart.id ? autoPart : ap));
	notify(globalNotification, `Added to shopping cart: ${autoPart.name}.`);
}
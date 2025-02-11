import saveAutoPart from "@/global-utils/shopping-cart-manipulation/saveAutoPart.js";
import notify from "@/global-utils/notifications/notify.js";

export default function selectAutoPart(autoPart, selectedState, globalNotification) {
	autoPart = {
		...autoPart,
		amount: autoPart.amount - 1,
		selectedAmount: 1,
		discount: 0
	};
	saveAutoPart(autoPart);
	selectedState.setSelectedAutoParts((prevSelectedAutoParts) => [...prevSelectedAutoParts, autoPart]);
	notify(globalNotification, `Added to shopping cart: ${autoPart.name}.`);
}
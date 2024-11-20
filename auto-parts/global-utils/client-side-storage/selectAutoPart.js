import generateGUID from "@/global-utils/GUID/generateGUID.js";
import saveAutoPart from "@/global-utils/client-side-storage/saveAutoPart.js";

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
	globalNotification.setNotifications(
		[
			{
				message: `Added to shopping cart: ${autoPart.name}.`,
				level: "info",
				key: generateGUID()
			},
			...globalNotification.notifications
		]
	);
}
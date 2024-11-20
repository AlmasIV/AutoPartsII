import generateGUID from "@/global-utils/GUID/generateGUID.js";

export default function deSelectAutoPart(autoPart, selectedState, globalNotification) {
	localStorage.removeItem(autoPart.id + "ap");
	selectedState.setSelectedAutoParts(
		[...selectedState.selectedAutoParts.filter((ap) => ap.id !== autoPart.id)]
	);
	globalNotification.setNotifications(
		[
			{
				message: `Removed from shopping cart: ${autoPart.name}.`,
				level: "warning",
				key: generateGUID()
			},
			...globalNotification.notifications
		]
	);
}
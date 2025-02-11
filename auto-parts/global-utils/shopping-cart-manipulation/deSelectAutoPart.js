import notify from "@/global-utils/notifications/notify.js";

export default function deSelectAutoPart(autoPart, selectedState, globalNotification) {
	localStorage.removeItem(autoPart.id + "ap");
	selectedState.setSelectedAutoParts((prevSelectedAutoParts) => prevSelectedAutoParts.filter((ap) => ap.id !== autoPart.id));
	notify(globalNotification, `Removed from shopping cart: ${autoPart.name}.`, "warning");
}
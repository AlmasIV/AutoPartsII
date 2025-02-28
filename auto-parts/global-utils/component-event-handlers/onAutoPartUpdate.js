import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan";
import notify from "@/global-utils/notifications/notify.js";

export default async function onAutoPartUpdate(event, globalNotification, autoPartsState, autoPartId) {
	try {
		const formData = new FormData(event.target);
		const response = await fetch(`/api/authenticated/auto-parts/update/${autoPartId}`, {
			method: "PUT",
			body: formData
		});
		redirectIfCan(response);
		const bodyData = await response.json();
		if(!response.ok) {
			notify(globalNotification, bodyData.data || `${response.status} ${response.statusText}`, "danger");
		}
		else {
			notify(globalNotification, `${bodyData.data.name} was successfully updated.`, "success");
			autoPartsState.setAutoParts(
				autoPartsState.autoParts.map((ap) => ap.id === autoPartId ? { ...bodyData.data } : ap)
			);
		}
	}
	catch(error) {
		notify(globalNotification, "Something went wrong.", "danger");
	}
}
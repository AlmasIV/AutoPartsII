import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan";
import notify from "@/global-utils/notifications/notify.js";

export default async function onAutoPartCreate(event, globalNotification, autoPartsState) {
    try {
        const formData = new FormData(event.target);
        const response = await fetch("/api/authenticated/auto-parts/create", {
            method: "POST",
            body: formData
        });
        redirectIfCan(response);
        const bodyData = await response.json();
        if(!response.ok) {
            notify(globalNotification, bodyData.data || `${response.status} ${response.statusText}`, "danger");
        }
        else {
            notify(globalNotification, `${bodyData.data.name} was successfully created.`, "success");
            if(autoPartsState.autoParts.length < 99) {
                autoPartsState.setAutoParts(
                    [
                        ...autoPartsState.autoParts,
                        bodyData.data
                    ]
                );
            }
            autoPartsState.setTotalAutoParts(total => total + 1);
        }
    }
    catch(error) {
        notify(globalNotification, "Something went wrong.", "danger");
    }
}
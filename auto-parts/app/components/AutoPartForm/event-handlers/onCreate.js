import generateGUID from "@/utils/GUID/generateGUID.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan";

export default async function onCreate(event, globalNotification, autoPartsState) {
    const formData = new FormData(event.target);
    await submitAutoPart(formData, globalNotification, autoPartsState);
}

async function submitAutoPart(formData, globalNotification, autoPartsState) {
    try {
        const response = await fetch("/api/authenticated/auto-parts/create", {
            method: "POST",
            cache: "no-cache",
            body: formData
        });
        redirectIfCan(response);
        const bodyData = await response.json();
        if(!response.ok) {
            globalNotification.setNotifications(
                [
                    {
                        message: bodyData.message || `${response.status} ${response.statusText}`,
                        level: "danger",
                        key: generateGUID()
                    },
                    ...globalNotification.notifications
                ]
            );
        }
        else {
            globalNotification.setNotifications(
                [
                    {
                        message: bodyData.message,
                        level: "success",
                        key: generateGUID()
                    },
                    ...globalNotification.notifications
                ]
            );
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
        globalNotification.setNotifications(
            [
                {
                    message: "Something went wrong.",
                    level: "danger",
                    key: generateGUID()
                },
                ...globalNotification.notifications
            ]
        );
    }
}
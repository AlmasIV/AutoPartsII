import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import generateGUID from "@/tools/GUID/GUID.js";

export default async function onCreate(event, globalNotification) {
    const autoPart = parseAutoPartFromForm(event);
    event.target.reset();
    await submitAutoPart(autoPart, globalNotification);
}

async function submitAutoPart(autoPart, globalNotification) {
    try {
        const result = await fetch("/api/authenticated/auto-parts/create", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(autoPart)
        });
        if(result.redirected){
            window.location.href = result.url;
            return;
        }
        const response = await result.json();
        if (result.ok) {
            globalNotification.setNotifications(
                [
                    {
                        message: response.message,
                        level: "success",
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
                        message: response.message,
                        level: "danger",
                        key: generateGUID()
                    },
                    ...globalNotification.notifications
                ]
            );
        }
    }
    catch (error) {
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

export function parseAutoPartFromForm(event) {
    const autoPart = {};
    let prop;
    const formElements = event.target.elements;
    for (let autoPartConfig of autoPartConfigs) {
        if (formElements[autoPartConfig.name]) {
            if (autoPartConfig.type === "number") {
                prop = Number(formElements[autoPartConfig.name].value);
            }
            else {
                prop = formElements[autoPartConfig.name].value;
            }
            autoPart[autoPartConfig.name] = prop;
        }
    }
    return autoPart;
}
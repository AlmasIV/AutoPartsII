import { autoPartConfigs } from "../../configurations/configs.js";
import generateGUID from "../../GUID Tool/GUID.js";

export default async function onCreate(event, globalNotification){
    const autoPart = parseAutoPartFromForm(event);
    event.target.reset();
    await submitAutoPart(autoPart, globalNotification);
}

async function submitAutoPart(autoPart, globalNotification){
    const result = await fetch("https://localhost:7019/auto-parts/create", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(autoPart)
    });
    if(result.ok){
        globalNotification.setNotifications(
            [
                {
                    message: `Successfully created: ${autoPart.name}.`,
                    level: "success",
                    key: generateGUID() 
                },
                ...globalNotification.notifications
            ]
        );
    }
    else{
        globalNotification.setNotifications(
            [
                {
                    message: `Failed to create: ${autoPart.name}.`,
                    level: "danger",
                    key: generateGUID()
                },
                ...globalNotification.notifications
            ]
        );
    }
}

export function parseAutoPartFromForm(event){
    const autoPart = {};
    let prop;
    const formElements = event.target.elements;
    for(let autoPartConfig of autoPartConfigs){
        if(formElements[autoPartConfig.name]){
            if(autoPartConfig.type === "number"){
                prop = Number(formElements[autoPartConfig.name].value);
            }
            else{
                prop = formElements[autoPartConfig.name].value;
            }
            autoPart[autoPartConfig.name] = prop;
        }
    }
    return autoPart;
}
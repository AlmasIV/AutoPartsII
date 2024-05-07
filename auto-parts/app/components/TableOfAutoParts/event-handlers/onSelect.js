"use client";

import { autoPartConfigs } from "../../configurations/configs.js";
import generateGUID from "../../GUID Tool/GUID.js";

export default function onSelect(event, selectedState, globalNotification){
    let target = event.target;
    if(target.tagName === "TD"){
        target = target.parentElement;
    }
    toggleSelection(target, selectedState, globalNotification);
}

function toggleSelection(element, selectedState, globalNotification){
    const autoPart = parseRowToObject(element);
    if(element.classList.contains("selected")){
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
    else{
        localStorage.setItem(autoPart.id + "ap", JSON.stringify(autoPart));
        // autoPart contains number data types. And selectedAutoParts might not.
        selectedState.setSelectedAutoParts(
            [...selectedState.selectedAutoParts, autoPart]
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
}

function parseRowToObject(row){
    const result = {};
    const availableItems = autoPartConfigs.filter((config) => config["inTable"]);
    const dataCells = row.querySelectorAll("td");
    let i = 0;
    for(i; i < availableItems.length; i ++){
        result[availableItems[i].name] = dataCells[i].textContent;
    }
    return result;
}
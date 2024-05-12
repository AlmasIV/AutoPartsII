"use client";

import { autoPartConfigs } from "../../configurations/configs.js";
import generateGUID from "../../GUID Tool/GUID.js";
import { currencyToNumber } from "../../NumberFormatters/formatters.js";

export default function onSelect(event, selectedState, globalNotification) {
    let target = event.target;
    if (target.tagName === "TD") {
        target = target.parentElement;
    }
    toggleSelection(target, selectedState, globalNotification);
}

// Also used in the ProductBox.
export function disselectAutoPart(autoPart, selectedState, globalNotification) {
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

export function setAutoPart(autoPart){
    localStorage.setItem(autoPart.id + "ap", JSON.stringify(autoPart));
}

export function selectAutoPart(autoPart, selectedState, globalNotification) {
    autoPart = {
        ...autoPart,
        amount: Number(autoPart.amount) - 1,
        selectedAmount: 1
    };
    setAutoPart(autoPart);
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

function toggleSelection(element, selectedState, globalNotification) {
    const autoPart = parseRowToObject(element);
    if (element.classList.contains("selected")) {
        disselectAutoPart(autoPart, selectedState, globalNotification);
    }
    else {
        selectAutoPart(autoPart, selectedState, globalNotification);
    }
}

function parseRowToObject(row) {
    const result = {};
    const availableItems = autoPartConfigs.filter((config) => config["inTable"]);
    const dataCells = row.querySelectorAll("td");
    let i = 0;
    let tdName = "";
    let tdContent = "";
    for (i; i < availableItems.length; i++) {
        tdName = availableItems[i].name;
        if(tdName === "priceInKzt" || tdName === "priceInRub"){
            tdContent = currencyToNumber(dataCells[i].textContent);
        }
        else {
            tdContent = dataCells[i].textContent;
        }
        result[tdName] = tdContent;
    }
    return result;
}
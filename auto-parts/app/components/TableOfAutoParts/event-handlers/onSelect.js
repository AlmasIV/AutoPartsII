"use client";

import generateGUID from "@/app/tools/GUID/GUID.js";

export default function onSelect(selectedState, globalNotification, autoPart) {
    toggleSelection(autoPart, selectedState, globalNotification);
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
        amount: autoPart.amount - 1,
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

function toggleSelection(autoPart, selectedState, globalNotification) {
    if (localStorage.getItem(autoPart.id + "ap")) {
        disselectAutoPart(autoPart, selectedState, globalNotification);
    }
    else {
        selectAutoPart(autoPart, selectedState, globalNotification);
    }
}
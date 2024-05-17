import { autoPartConfigs } from "../../configurations/configs.js";
import generateGUID from "../../GUID Tool/GUID.js";

export default async function onSell(globalNotification, setSelectedAutoParts){
    const orderSummary = {
        totalPriceInKzt: 0,
        orderedParts: []
    };
    let tempAutoPart = null, tempProp = null;
    Object.keys(localStorage)
        .filter((keyItem) => keyItem.includes("ap"))
        .map((keyItem) => JSON.parse(localStorage.getItem(keyItem)))
        .forEach((ap) => {
            tempAutoPart = {};
            autoPartConfigs.forEach((apconfig) => {
                if(apconfig["inTable"]){
                    if(apconfig["type"] === "number"){
                        tempProp = Number(ap[apconfig["name"]]);
                    }
                    else{
                        tempProp = ap[apconfig["name"]];
                    }
                    tempAutoPart[apconfig["name"]] = tempProp;
                }
            });
            tempAutoPart.amount = ap.selectedAmount;
            orderSummary.orderedParts.push(tempAutoPart);
            orderSummary.totalPriceInKzt += tempAutoPart.amount * tempAutoPart.priceInKzt;
        });
    await orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts);
}

async function orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts){
    const result = await fetch("https://localhost:7019/auto-parts/order", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderSummary)
    });
    if(result.ok){
        globalNotification.setNotifications(
            [
                {
                    message: `Successfully sold: ${orderSummary.orderedParts.length} auto parts.`,
                    level: "success",
                    key: generateGUID()
                },
                ...globalNotification.notifications
            ]
        );
        orderSummary.orderedParts.forEach((autoPart) => {
            localStorage.removeItem(autoPart.id + "ap");
        });
        setSelectedAutoParts([]);
    }
    else{
        globalNotification.setNotifications(
            [
                {
                    message: `Failed to sell: ${orderSummary.orderAutoParts.length} auto parts.`,
                    level: "danger",
                    key: generateGUID()
                },
                ...globalNotification.notifications
            ]
        );
    }
}
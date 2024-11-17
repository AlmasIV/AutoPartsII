import generateGUID from "@/global-utils/GUID/generateGUID.js";
import redirectIfCan from "@/global-utils/response-helpers/redirectIfCan";

export default async function onSell(globalNotification, selectedAutoParts, setSelectedAutoParts, autoPartsState, historyPageState) {
    const orderSummary = {
        totalPriceInKzt: 0,
        orderedParts: []
    };
    selectedAutoParts.forEach((ap) => {
        const { selectedAmount, ...autoPart } = ap;
        let price = selectedAmount * autoPart.priceInKzt - ap.discount;
        orderSummary.totalPriceInKzt += price;
        autoPart.amount = selectedAmount;
        orderSummary.orderedParts.push(autoPart);
    });
    await orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts, autoPartsState, historyPageState);
}

async function orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts, autoPartsState, historyPageState) {
    try {
        const response = await fetch("/api/authenticated/auto-parts/sell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderSummary)
        });
        redirectIfCan(response);
        if(!response.ok) {
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
        else {
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
            const soldParts = autoPartsState.autoParts.filter((ap) => orderSummary.orderedParts.some((op) => op.id === ap.id));
            orderSummary.orderedParts.forEach((autoPart) => {
                localStorage.removeItem(autoPart.id + "ap");
                soldParts.find((ap) => ap.id === autoPart.id).amount -= autoPart.amount;
            });
            let tempOp = null;
            const updatedAutoParts = [];
            autoPartsState.autoParts.forEach((ap) => {
                tempOp = soldParts.find((op) => op.id === ap.id);
                if(tempOp) {
                    updatedAutoParts.push(tempOp);
                }
                else {
                    updatedAutoParts.push(ap);
                }
            });
            autoPartsState.setAutoParts(updatedAutoParts);
            setSelectedAutoParts([]);

            // Update the history page data.
            historyPageState.setTotalOrders(historyPageState.totalOrders + 1);
            if(historyPageState.orders.length < 100) {
                const order = await response.json();
                historyPageState.setOrders(
                    [
                        order.data,
                        ...historyPageState.orders
                    ]
                );
            }
        }
    }
    catch {
        globalNotification.setNotifications([
            {
                message: "Something went wrong.",
                level: "danger",
                key: generateGUID()
            },
            ...globalNotification.notifications
        ]);
    }
}
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan";
import notify from "@/global-utils/notifications/notify.js";

export default async function onAutoPartsSell(globalNotification, selectedAutoParts, setSelectedAutoParts, autoPartsState, historyPageState) {
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
            notify(globalNotification, `Failed to sell: ${orderSummary.orderAutoParts.length} auto parts.`, "danger");
        }
        else {
            notify(globalNotification, `Successfully sold: ${orderSummary.orderedParts.length} auto parts.`, "success");
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
        notify(globalNotification, "Something went wrong.", "danger");
    }
}
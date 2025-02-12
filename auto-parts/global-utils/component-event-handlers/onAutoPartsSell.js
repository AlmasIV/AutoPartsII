import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan";
import notify from "@/global-utils/notifications/notify.js";

export default async function onAutoPartsSell(globalNotification, selectedAutoPartsState, autoPartsState, ordersState) {
    let price;
    const orderSummary = {
        totalPriceInKzt: 0,
        orderedParts: []
    };
    selectedAutoPartsState.selectedAutoParts.forEach((ap) => {
        const { selectedAmount, ...autoPart } = ap;
        price = selectedAmount * autoPart.priceInKzt - ap.discount;
        orderSummary.totalPriceInKzt += price;
        autoPart.amount = selectedAmount;
        orderSummary.orderedParts.push(autoPart);
    });
    await orderAutoParts(orderSummary, globalNotification, selectedAutoPartsState.setSelectedAutoParts, autoPartsState, ordersState);
}

async function orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts, autoPartsState, ordersState) {
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

            ordersState.setTotalOrdersCount(ordersState.totalOrdersCount + 1);
            if(ordersState.orders.length < 100) {
                const order = await response.json();
                ordersState.setOrders(
                    [
                        order.data,
                        ...ordersState.orders
                    ]
                );
            }
        }
    }
    catch {
        notify(globalNotification, "Something went wrong.", "danger");
    }
}
import generateGUID from "@/tools/GUID/GUID.js";

export default async function onSell(globalNotification, selectedAutoParts, setSelectedAutoParts, autoPartsState) {
    const orderSummary = {
        totalPriceInKzt: 0,
        orderedParts: []
    };
    selectedAutoParts.forEach((ap) => {
        const { selectedAmount, ...autoPart } = ap;
        orderSummary.totalPriceInKzt += selectedAmount * autoPart.priceInKzt;
        autoPart.amount = selectedAmount;
        orderSummary.orderedParts.push(autoPart);
    });
    await orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts, autoPartsState);
}

async function orderAutoParts(orderSummary, globalNotification, setSelectedAutoParts, autoPartsState) {
    try {
        const result = await fetch("/api/authenticated/auto-parts/sell", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderSummary)
        });
        if(result.redirected) {
            window.location.href = result.url;
            return;
        }
        if(result.ok) {
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
        }
        else {
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
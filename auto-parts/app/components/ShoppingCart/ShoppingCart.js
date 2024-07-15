"use client";

import { useState, useEffect, useContext } from "react";
import { Form, ProductBox, Button } from "@/app/components/Index.js";
import { KZTFormatter } from "@/utils/numberFormatters/formatters.js";
import onSell from "@/app/components/ShoppingCart/event-handlers/onSell.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import styles from "./shopping-cart.module.css";

export default function ShoppingCart(
    {
        selectedAutoParts,
        setSelectedAutoParts,
        autoParts,
        setAutoParts
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    const [totalPriceKzt, setTotalPriceKzt] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        setTotalPriceKzt(selectedAutoParts.reduce((accumulator, ap) => accumulator + ap.selectedAmount * ap.priceInKzt, 0));
    }, [selectedAutoParts]);
    async function handleOnSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        await onSell(globalNotification, selectedAutoParts, setSelectedAutoParts, { autoParts, setAutoParts });
        setIsSubmitting(false);
    }
    return selectedAutoParts.length > 0 ? (
        <Form
            formType="flex-column-form"
            method="dialog"
            onSubmit={handleOnSubmit}
        >
            {
                selectedAutoParts.map((ap) => {
                    return (
                        <ProductBox
                            key={ap.id}
                            autoPart={ap}
                            selectedAutoParts={selectedAutoParts}
                            setSelectedAutoParts={setSelectedAutoParts}
                            price={ap.selectedAmount * Number(ap.priceInKzt)}
                        />
                    );
                })
            }
            <p
                className={styles["total-price"]}
            >
                Total Price: {KZTFormatter.format(totalPriceKzt)}
            </p>
            <Button
                type="submit"
                title="Sell"
                className={`${isSubmitting ? "disabled-btn" : "primary-btn"} margin-top-05rem`}
            />
        </Form>
    ) : (
        <h2
            className="opacity-08 text-center margin-top-05rem margin-bottom-05rem"
        >
            Select something to sell
        </h2>
    );
}
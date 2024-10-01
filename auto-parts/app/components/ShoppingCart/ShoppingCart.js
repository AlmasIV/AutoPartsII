"use client";

import { useState, useEffect, useContext } from "react";
import { Form, ProductBox, Button } from "@/app/components/Index.js";
import { KZTFormatter } from "@/utils/numberFormatters/index.js";
import onSell from "@/app/components/ShoppingCart/event-handlers/onSell.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { OrdersStateContext } from "@/app/components/Orders/OrdersStateContext.js";
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
    const { orders, setOrders, totalOrders, setTotalOrders } = useContext(OrdersStateContext);
    const [totalPriceKzt, setTotalPriceKzt] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        let isIgnore = false;
        if(!isIgnore){
            setTotalPriceKzt(selectedAutoParts.reduce((accumulator, ap) => {
                let price = ap.selectedAmount * Number(ap.priceInKzt) - ap.discount;
                return accumulator + price;
            }, 0));
        }

        return () => { isIgnore = true };
    }, [selectedAutoParts]);
    async function handleOnSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        await onSell(globalNotification, selectedAutoParts, setSelectedAutoParts, { autoParts, setAutoParts }, { orders, setOrders, totalOrders, setTotalOrders });
        setIsSubmitting(false);
    }
    return selectedAutoParts.length > 0 ? (
        <Form
            method="dialog"
            onSubmit={handleOnSubmit}
        >
            {
                selectedAutoParts.map((ap) => {
                    let price = ap.selectedAmount * Number(ap.priceInKzt) - ap.discount;
                    return (
                        <ProductBox
                            key={ap.id}
                            autoPart={ap}
                            selectedAutoParts={selectedAutoParts}
                            setSelectedAutoParts={setSelectedAutoParts}
                            price={price}
                            discount={ap.discount}
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
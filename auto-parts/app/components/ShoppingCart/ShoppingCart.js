"use client";

import { useState, useEffect, useContext } from "react";
import styles from "@/app/components/ShoppingCart/shopping-cart.module.css";
import { Form, ProductBox, Button } from "@/app/components/Index.js";
import { KZTFormatter } from "@/tools/NumberFormatters/formatters.js";
import onSell from "@/app/components/ShoppingCart/event-handlers/onSell.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";

export default function ShoppingCart(
    {
        selectedAutoParts,
        setSelectedAutoParts,
        autoParts,
        setAutoParts
    }
){
    const globalNotification = useContext(NotificationBoxContext);
    const [totalPriceKzt, setTotalPriceKzt] = useState(0);
    useEffect(() => {
        setTotalPriceKzt(selectedAutoParts.reduce((accumulator, ap) => accumulator + ap.selectedAmount * ap.priceInKzt, 0));
    }, [selectedAutoParts]);
    return selectedAutoParts.length > 0 ? (
        <Form
            formType="flex-column-form"
            method="dialog"
            onSubmit={(e) => {
                e.preventDefault();
                onSell(globalNotification, selectedAutoParts, setSelectedAutoParts, { autoParts, setAutoParts });
            }}
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
                className="primary-btn margin-top-05rem"
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
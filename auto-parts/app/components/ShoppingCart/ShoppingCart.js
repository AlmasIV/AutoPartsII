"use client";

import { useState, useEffect } from "react";
import styles from "./shopping-cart.module.css";
import { Form, ProductBox, Button } from "../Index.js";
import { KZTFormatter } from "../NumberFormatters/formatters.js";

export default function ShoppingCart(
    {
        selectedAutoParts,
        setSelectedAutoParts
    }
){
    const [totalPriceKzt, setTotalPriceKzt] = useState(0);
    useEffect(() => {
        setTotalPriceKzt(selectedAutoParts.reduce((accumulator, ap) => accumulator + ap.selectedAmount * Number(ap.priceInKzt), 0));
    }, [selectedAutoParts]);
    return selectedAutoParts.length > 0 ? (
        <Form
            formType="flex-column-form"
            method="dialog"
            onSubmit={(e) => {
                e.preventDefault();
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
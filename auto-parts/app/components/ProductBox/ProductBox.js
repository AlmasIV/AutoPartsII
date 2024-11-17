"use client";

import { useContext } from "react";
import { AmountChanger, Button, AutoPartDescription, DiscountApplier } from "@/app/components/Index.js";
import { disselectAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { KZTFormatter } from "@/global-utils/number-formatters/index.js";
import styles from "./product-box.module.css";

export default function ProductBox(
    {
        autoPart,
        selectedAutoParts,
        setSelectedAutoParts,
        price,
        discount
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    return (
        <div
            className={`${styles["auto-part-box"]} flex-container space-between`}
        >
            <div>
                {
                    <AutoPartDescription
                        autoPart={autoPart}
                    />
                }
                <p
                    key="price"
                    className="margin-top-05rem"
                >
                    <span
                        className="opacity-08"
                    >
                        Calculated Price:
                    </span>
                    {" " + KZTFormatter.format(price)}
                    {
                        discount > 0 &&
                        (
                            <span
                                className="color-danger"
                            >
                                {" (-" + KZTFormatter.format(discount) + ")"}
                            </span>
                        )
                    }
                </p>
                <Button
                    title="Remove"
                    className="width-full danger-btn margin-top-05rem"
                    type="button"
                    onClick={() => {
                        disselectAutoPart(autoPart, { selectedAutoParts, setSelectedAutoParts }, globalNotification);
                    }}
                />
            </div>
            <div
                className="flex-container flex-column space-between flex-grow-1 align-end"
            >
                <AmountChanger
                    selectedAutoParts={selectedAutoParts}
                    setSelectedAutoParts={setSelectedAutoParts}
                    selectedAutoPart={autoPart}
                />
                <DiscountApplier
                    selectedAutoParts={selectedAutoParts}
                    setSelectedAutoParts={setSelectedAutoParts}
                    selectedAutoPart={autoPart}
                />
            </div>
        </div>
    );
}
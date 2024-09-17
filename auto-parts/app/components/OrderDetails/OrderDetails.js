"use client";

import { KZTFormatter } from "@/utils/numberFormatters/index.js";
import styles from "./order-details.module.css";
import { AutoPartDescription, RefundOrder } from "@/app/components/Index.js";
import { useState } from "react";

export default function OrderDetails(
    {
        details
    }
) {
    const [orderedParts, setOrderedParts] = useState(details);
    return (
        <div>
            <p>
                <span
                    className="opacity-08"
                >
                    Total price in tenge:
                </span> {KZTFormatter.format(orderedParts.totalPriceInKzt)}
            </p>
            <p>
                <span
                    className="opacity-08"
                >
                    Sold parts:
                </span>
            </p>
            <div>
                {
                    orderedParts.soldParts.map((sp) => {
                        return (
                            <div
                                key={sp.soldPart.id}
                                className={`${styles["auto-part-detail"]} margin-top-05rem`}
                            >
                                <AutoPartDescription
                                    autoPart={sp.soldPart}
                                />
                                <p>
                                    <span
                                        className="opacity-08"
                                    >
                                        Sold amount:
                                    </span> {sp.soldAmount}
                                </p>
                                <p>
                                    <span
                                        className="opacity-08"
                                    >
                                        Price:
                                    </span> {sp.price}
                                </p>
                                <p>
                                    <span
                                        className="opacity-08"
                                    >
                                        Discount Percentage:
                                    </span> {`${sp.discountPercentage ?? "0"}% (${KZTFormatter.format((sp.discountPercentage / 100) * sp.soldPart.priceInKzt)})`}
                                </p>
                                <RefundOrder
                                    soldPartDetails={sp}
                                    orderedParts={orderedParts}
                                    setOrderedParts={setOrderedParts}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
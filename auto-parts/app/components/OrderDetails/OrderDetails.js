import { KZTFormatter } from "@/utils/numberFormatters/formatters.js";
import styles from "./order-details.module.css";
import { AutoPartDescription } from "@/app/components/Index.js";

export default function OrderDetails(
    {
        details
    }
) {
    return (
        <div>
            <p>
                <span
                    className="opacity-08"
                >
                    Total price in tenge:
                </span> {KZTFormatter.format(details.totalPriceInKzt)}
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
                    details.soldParts.map((sp) => {
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
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
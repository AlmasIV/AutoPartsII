
import { KZTFormatter } from "@/tools/NumberFormatters/formatters.js";
import autoPartConfigs from "@/configurations/auto-part-configuration.json"
import styles from "./order-details.module.css"

export default function OrderDetails(
    {
        details
    }
){
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
                                {
                                    autoPartConfigs.map((apc) => {
                                        if(sp.soldPart[apc.name]){
                                            return (
                                                <p
                                                    key={apc.name}
                                                >
                                                    <span
                                                        className="opacity-08"
                                                    >
                                                        {
                                                            apc.name === "amount" ? "In stock:" : apc.labelName + ":"
                                                        }
                                                    </span> {sp.soldPart[apc.name]}
                                                </p>
                                            );
                                        }
                                    })
                                }
                                <p>
                                    <span
                                        className="opacity-08"
                                    >
                                        Sold amount:
                                    </span> {sp.soldAmount}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
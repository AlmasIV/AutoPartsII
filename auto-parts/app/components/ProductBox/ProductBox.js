"use client";

import { useContext } from "react";
import { autoPartConfigs } from "../configurations/configs.js";
import styles from "./product-box.module.css";
import { AmountChanger, Button } from "../Index.js";
import { disselectAutoPart } from "../TableOfAutoParts/event-handlers/onSelect.js";
import { NotificationBoxContext } from "../NotificationBox/NotificationBoxContext.js";
import { KZTFormatter, RUBFormatter } from "../NumberFormatters/formatters.js";

export default function ProductBox(
    {
        autoPart,
        selectedAutoParts,
        setSelectedAutoParts,
        price
    }
) {
    const validConfigs = autoPartConfigs.filter((config) => config["inTable"]);
    const globalNotification = useContext(NotificationBoxContext);
    return (
        <div
            className={styles["auto-part-box"]}
        >
            <div>
                {
                    validConfigs.map((config) => {
                        let isAmount = config.labelName === "Amount";
                        let isCurrency = config.name === "priceInKzt" || config.name === "priceInRub";
                        return (
                            <p
                                key={config.labelName}
                                className="margin-top-05rem"
                            >
                                <span
                                    className="opacity-08"
                                >
                                    {
                                        isAmount ? "In Stock: " : config.labelName + ": "
                                    }
                                </span>
                                {
                                    isAmount ? autoPart.amount : isCurrency ? config.name === "priceInKzt" ? KZTFormatter.format(autoPart[config.name]) : RUBFormatter.format(autoPart[config.name]) : autoPart[config.name]
                                }
                            </p>
                        );
                    })
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
            <AmountChanger
                selectedAutoParts={selectedAutoParts}
                setSelectedAutoParts={setSelectedAutoParts}
                selectedAutoPart={autoPart}
            />
        </div>
    );
}
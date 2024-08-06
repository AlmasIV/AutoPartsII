"use client";

import { Fragment, useContext } from "react";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { KZTFormatter, RUBFormatter } from "@/utils/numberFormatters/formatters.js";
import onSelect from "./event-handlers/onSelect.js";
import styles from "./table-of-auto-parts.module.css";
import generateGUID from "@/utils/GUID/GUID.js";

export default function TableOfAutoParts(
    {
        autoPartCollection,
        selectedAutoParts,
        setSelectedAutoParts
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    const tableConfigs = autoPartConfigs.filter((config) => config["inTable"]);
    return (
        <Fragment>
            <table
                id={styles["auto-parts-table"]}
            >
                <thead>
                    <tr>
                        {
                            tableConfigs.map((tc) => {
                                return (
                                    <th
                                        key={tc.labelName}
                                        scope="col"
                                        className="text-center"
                                    >
                                        {tc.labelName}
                                    </th>
                                );
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        autoPartCollection.map((autoPart) => (
                            <tr
                                key={autoPart.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(autoPart.amount > 0) {
                                        onSelect({ selectedAutoParts, setSelectedAutoParts }, globalNotification, autoPart);
                                    }
                                    else {
                                        globalNotification.setNotifications(
                                            [
                                                {
                                                    message: `Cannot add, 0 in stock: ${autoPart.name}.`,
                                                    level: "danger",
                                                    key: generateGUID()
                                                },
                                                ...globalNotification.notifications
                                            ]
                                        );
                                    }
                                }}
                                className={selectedAutoParts.some(ap => Number(ap.id) === autoPart.id) ? "selected" : ""}
                            >
                                {
                                    tableConfigs.map((config) => (
                                        <td
                                            key={config.labelName}
                                            className={`${config.name === "amount" ? autoPart.amount <= 0 ? "color-danger" : "" : ""} text-center`}
                                        >
                                            {
                                                config.name === "priceInRub" ? RUBFormatter.format(autoPart[config.name]) : config.name === "priceInKzt" ? KZTFormatter.format(autoPart[config.name]) : autoPart[config.name]
                                            }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Fragment>
    );
}
"use client";

import { Fragment, useContext, useState } from "react";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { KZTFormatter, RUBFormatter } from "@/utils/numberFormatters/formatters.js";
import onSelect from "./event-handlers/onSelect.js";
import { Modal, AutoPartDescription } from "@/app/components/Index.js";
import styles from "./table-of-auto-parts.module.css";

export default function TableOfAutoParts(
    {
        autoPartCollection,
        selectedAutoParts,
        setSelectedAutoParts
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    const tableConfigs = autoPartConfigs.filter((config) => config["inTable"]);
    const [isSelectPressed, setIsSelectPressed] = useState(false);
    const [selectedAutoPart, setSelectedAutoPart] = useState(null);
    return (
        <Fragment>
            {
                isSelectPressed && (
                    <Modal
                        closeButtonTitle="Cancel"
                        openButtonClass="display-none"
                        closeButtonClass="width-full secondary-btn"
                        dialogType="shopping-cart-modal"
                        onCloseButtonClick={() => setIsSelectPressed(false)}
                        isOpen={true}
                    >
                        <AutoPartDescription
                            autoPart={selectedAutoPart}
                        />
                    </Modal>
                )
            }
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
                                    setIsSelectPressed(true);
                                    setSelectedAutoPart(autoPart);
                                    // onSelect({ selectedAutoParts, setSelectedAutoParts }, globalNotification, autoPart);
                                }}
                                className={selectedAutoParts.some(ap => Number(ap.id) === autoPart.id) ? "selected" : ""}
                            >
                                {
                                    tableConfigs.map((config) => (
                                        <td
                                            key={config.labelName}
                                            className="text-center"
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
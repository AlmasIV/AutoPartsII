"use client";

import { Fragment, useContext } from "react";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { KZTFormatter } from "@/global-utils/number-formatters/index.js";
import onAutoPartSelect from "@/global-utils/component-event-handlers/onAutoPartSelect.js";
import styles from "./table-of-auto-parts.module.css";
import { Modal, AutoPartForm } from "@/app/components/Index.js";
import notify from "@/global-utils/notifications/notify.js";
import onAutoPartUpdate from "@/global-utils/component-event-handlers/onAutoPartUpdate.js";

let isDescriptionOpen = false;

export default function TableOfAutoParts(
    {
        autoPartsState,
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
                <tbody
                    onClick={(e) => {
                        if(!isDescriptionOpen) {
                            const autoPartRow = e.target.closest("tr");
                            const autoPartId = autoPartRow?.querySelector("td")?.textContent;
                            if(autoPartId) {
                                const autoPart = autoPartsState.autoParts.find((ap) => ap.id === autoPartId);
                                if(autoPart.amount > 0) {
                                    onAutoPartSelect({ selectedAutoParts, setSelectedAutoParts }, globalNotification, autoPart);
                                }
                                else {
                                    notify(globalNotification, `Cannot add, 0 in stock: ${autoPart.name}.`, "danger");
                                }
                            }
                        }
                    }}
                >
                    {
                        autoPartsState.autoParts.map((autoPart) => (
                            <tr
                                key={autoPart.id}
                                className={selectedAutoParts.some((sp) => sp.id === autoPart.id) ? "selected" : ""}
                            >
                                {
                                    tableConfigs.map((config) => (
                                        <td
                                            key={config.labelName}
                                            className={`${config.name === "amount" && autoPart.amount <= 0 ? "color-danger" : config.name === "name" ? "" : ""} text-center`}
                                        >
                                            {
                                                config.name === "priceInKzt" ? KZTFormatter.format(autoPart[config.name]) : config.name === "name" ?
                                                    <Modal
                                                        openButtonTitle={autoPart[config.name]}
                                                        closeButtonTitle="Back"
                                                        openButtonClass=""
                                                        closeButtonClass="secondary-btn width-full margin-top-05rem"
                                                        dialogType="fixed-modal"
                                                        dataModalId={autoPart[config.key]}
                                                        onCloseButtonClick={(e) => {
                                                            isDescriptionOpen = false;
                                                            e.stopPropagation();
                                                        }}
                                                        onOpenButtonClick={(e) => {
                                                            isDescriptionOpen = true;
                                                        }}
                                                        onModalClose={(e) => {
                                                            if(document.querySelector("table tr td div > dialog") === e.target) {
                                                                isDescriptionOpen = false;
                                                            }
                                                        }}
                                                    >
                                                        <AutoPartForm
                                                            formTitle="Current Info"
                                                            submitButtonTitle="Update"
                                                            onSubmit={async (e) => {
                                                                await onAutoPartUpdate(e, globalNotification, autoPartsState, autoPart.id);
                                                            }}
                                                            autoPartsState={autoPartsState}
                                                            autoPart={autoPart}
                                                        />
                                                    </Modal>
                                                    : autoPart[config.name]
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
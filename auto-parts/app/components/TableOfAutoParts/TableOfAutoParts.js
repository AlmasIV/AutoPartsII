"use client";

import { useEffect, useState, useContext } from "react";
import { autoPartConfigs } from "../configurations/configs.js";
import styles from "./table-of-auto-parts.module.css";
import onSelect from "./event-handlers/onSelect.js";
import { NotificationBoxContext } from "../NotificationBox/NotificationBoxContext.js";

export default function TableOfAutoParts(
    {
        autoPartCollection,
        selectedAutoParts,
        setSelectedAutoParts
    }
){
    const globalNotification = useContext(NotificationBoxContext);
    

    const tableConfigs = autoPartConfigs.filter((config) => config["inTable"]);

    useEffect(() => {
        const selected = [];
        let i = 0;
        let ap = null;
        for(i; i < localStorage.length; i ++){
            ap = localStorage.key(i);
            if(ap.includes("ap")){
                selected.push(JSON.parse(localStorage.getItem(ap)));
            }
        }
        setSelectedAutoParts([...selected]);
    }, []);
    return (
        <table id={styles["auto-parts-table"]}>
            <thead>
                <tr>
                    {
                        autoPartConfigs.map((autoPartConfig) => {
                            if(autoPartConfig["inTable"]){
                                return (
                                    <th
                                        key={autoPartConfig.labelName}
                                        scope="col"
                                        className="text-center"
                                    >
                                        {autoPartConfig.labelName}
                                    </th>
                                );
                            }
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
                                onSelect(e, { selectedAutoParts, setSelectedAutoParts }, globalNotification);
                            }}
                            className={selectedAutoParts.some(ap => Number(ap.id) === autoPart.id) ? "selected" : ""}
                        >
                            {
                                tableConfigs.map((config) => (
                                    <td
                                        key={config.labelName}
                                        className="text-center"
                                    >
                                        {autoPart[config.name]}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
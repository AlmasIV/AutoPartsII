import { autoPartConfigs } from "../configurations/configs.js";
import styles from "./table-of-auto-parts.module.css";

export default function TableOfAutoParts({ autoPartCollection }){
    const tableConfigs = autoPartConfigs.filter((config) => config["inTable"]);
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
                        >
                            {
                                tableConfigs.map((config) => (
                                    <td
                                        key={config.labelName}
                                    >
                                        {autoPart[config.name] ?? "Unknown"}
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
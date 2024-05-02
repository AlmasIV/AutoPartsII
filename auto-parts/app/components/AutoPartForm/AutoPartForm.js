import { Fragment } from "react";
import styles from "./auto-part-form.module.css";

import { Input } from "../Index.js";

import { autoPartConfigs } from "../configurations/configs.js";

export default function AutoPartForm({ formTitle, buttonTitle, onSubmit, autoPart = null }) {
    return (
        <Fragment>
            <h2
                id={styles["form-title"]}
            >
                {formTitle}
            </h2>
            <form 
                id={styles["auto-part-form"]}
                method="dialog"
            >
                {
                    autoPartConfigs.map(
                        (autoPartConfig) => (
                            autoPart === null ? (
                                autoPartConfig.name !== "id" && 
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                />
                            ) : (
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                    autoPart={autoPart}
                                />
                            )
                        )
                    )
                }
                <button
                    type="submit"
                    className="primary-btn margin-top-2rem"
                    onClick={onSubmit}
                >
                    {buttonTitle}
                </button>
            </form>
        </Fragment>
    );
}
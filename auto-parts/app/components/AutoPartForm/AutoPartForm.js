import { Fragment } from "react";
import styles from "./auto-part-form.module.css";

import inputConfigs from "./configuration/auto-part-form-configuration.json";

export default function AutoPartForm({ formTitle, buttonTitle, onSubmit }) {
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
                    inputConfigs.map((inputConfig) => (
                        <label key={inputConfig.labelName}>
                            {inputConfig.labelName}
                            <input
                                name={inputConfig.name}
                                type={inputConfig.type}
                                required={inputConfig?.required || null}
                                minLength={inputConfig?.minLength || null}
                                autoFocus={inputConfig?.autoFocus || null}
                                min={inputConfig?.min || null}
                                max={inputConfig?.max || null}
                                step={inputConfig?.step || null}
                            />
                        </label>
                    ))
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
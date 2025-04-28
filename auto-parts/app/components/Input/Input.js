"use client";

import getInputValidator from "@/global-utils/validators/getInputValidator.js";
import styles from "./input.module.css";
import { useEffect, useState } from "react";

export default function Input(
    {
        config,
        validationErrorsState,
        defaultValue = null
    }
) {
    const [value, setValue] = useState(defaultValue ?? "");
    const [warning, setWarning] = useState(null);
    const validate = getInputValidator(config, setWarning);
    function handleOnChange(event) {
        const value = event.target.value;
        setValue(value);
        if(!validate(value)) {
            validationErrorsState.setValidationErrors(prevErrors => new Set(prevErrors).add(config.name));
        }
        else {
            validationErrorsState.setValidationErrors(prevErrors => {
                const updatedErrors = new Set(prevErrors);
                updatedErrors.delete(config.name);
                return updatedErrors;
            });
        }
    }
    useEffect(() => {
        if(config.required && value.length === 0) {
            setWarning("This is a required field. Please enter something.");
            validationErrorsState.setValidationErrors(prevErrors => new Set(prevErrors).add(config.name));
        }
    }, [value, config.required]);
    return (
        <label className={styles["input-label"]}>
            {config.labelName}
            <input
                name={config.name}
                type={config.type}
                step={config?.step || null}
                value={value}
                onChange={handleOnChange}
            />
            <span
                className="color-warning small-text"
            >
                {warning}
            </span>
        </label>
    );
}
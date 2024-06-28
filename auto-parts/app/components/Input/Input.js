"use client";

import styles from "./input.module.css";
import { isEmail } from "validator";
import { useEffect, useState } from "react";

export default function Input(
    {
        config,
        validationErrorsState,
        defaultValue = ""
    }
) {
    const [value, setValue] = useState(defaultValue);
    const [warning, setWarning] = useState(null);
    let validate;
    switch(config.type) {
        case "password":
        case "text":
            const minLength = config.required ? Math.max(config.minLength ?? 0, 0) : 0;
            const maxLength = Math.max(config.maxLength ?? 1000, minLength + 10);
            validate = (value) => {
                if(typeof value === "string") {
                    if(value.startsWith(" ") || value.endsWith(" ")) {
                        setWarning("Text cannot start or end with the space.");
                        return false;
                    }
                    if(value.length < minLength || value.length > maxLength) {
                        setWarning(`Text's length must be between ${minLength}(inclusive) and ${maxLength}(inclusive).`);
                        return false;
                    }
                    return true;
                }
                throw new TypeError(`The "value" must be a string. It was: "${typeof value}".`);
            };
            break;
        case "email":
            validate = (value) => {
                if(!isEmail(value)) {
                    setWarning("Please enter a valid email address.");
                    return false;
                }
                return true;
            };
            break;
        case "number":
            const min = Math.max(config.min ?? 0, 0);
            const max = Math.max(config.max ?? 999, min + 100);
            validate = (value) => {
                const num = Number(value);
                if(isNaN(num)) {
                    setWarning("Please enter a valid number.");
                    return false;
                }
                if(num < min || num > max || !Number.isFinite(num)) {
                    setWarning(`Number must be between ${min}(inclusive) and ${max}(inclusive).`);
                    return false;
                }
                return true;
            };
            break;
        default:
            throw new Error("Unknown config type.");
    }
    function handleOnChange(event) {
        const value = event.target.value;
        setWarning(null);
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
        <label className={`${styles["input-label"]} text-left`}>
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
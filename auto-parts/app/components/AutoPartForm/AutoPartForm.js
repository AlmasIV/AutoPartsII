import { Fragment } from "react";
import styles from "./auto-part-form.module.css";

export default function AutoPartForm({ formTitle, buttonTitle, onSubmit }){
    return (
        <Fragment>
            <h2 id={styles["form-title"]}>{formTitle}</h2>
            <form id={styles["auto-part-form"]} method="dialog">
                <label>
                    Name
                    <input type="text" name="name" required minLength="3" autoFocus />
                </label>
                <label>
                    Applicability
                    <input type="text" name="applicability" required minLength="3" />
                </label>
                <label>
                    Company
                    <input type="text" name="company" required />
                </label>
                <label>
                    Price in Rubles
                    <input type="number" min="0" max="99999999.99" step="1" />
                </label>
                <label>
                    Price in Tenge
                    <input type="number" min="1" max="99999999.99" step="1" required />
                </label>
                <label>
                    Amount
                    <input type="number" min="0" max="65535" step="1" required />
                </label>
                <button type="submit" className="primary-btn margin-top-2rem" onClick={onSubmit}>{buttonTitle}</button>
            </form>
        </Fragment>
    );
}
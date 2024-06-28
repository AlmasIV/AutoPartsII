import styles from "./form.module.css";

export default function Form(
    {
        children,
        formType,
        method,
        onSubmit
    }
) {
    return (
        <form
            className={styles[formType]}
            method={method}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
}
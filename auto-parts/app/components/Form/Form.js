import styles from "./form.module.css";

export default function Form(
    {
        children,
        formType,
        method,
        onSubmit,
        enctype = "application/x-www-form-urlencoded"
    }
) {
    return (
        <form
            className={styles[formType]}
            method={method}
            onSubmit={onSubmit}
            encType={enctype}
        >
            {children}
        </form>
    );
}
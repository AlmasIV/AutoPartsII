import styles from "./form.module.css";

export default function Form(
    {
        children,
        method,
        onSubmit,
        enctype = "application/x-www-form-urlencoded"
    }
) {
    return (
        <form
            className="flex-container flex-column space-between"
            method={method}
            onSubmit={onSubmit}
            encType={enctype}
        >
            {children}
        </form>
    );
}
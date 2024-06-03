import styles from "@/app/components/ErrorBox/error-box.module.css";

export default function ErrorBox(
    {
        error,
        errorBoxClassName = ""
    }
) {
    return (
        <div
            className={`${styles["error-box"]} text-center ${errorBoxClassName}`}
        >
            <h3>
                Error
            </h3>
            <p>
                {error.message}
            </p>
        </div>
    );
}
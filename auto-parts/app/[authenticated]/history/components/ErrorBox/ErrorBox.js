import styles from "@/app/[authenticated]/history/components/ErrorBox/error-box.module.css";

export default function ErrorBox(
    {
        error
    }
) {
    return (
        <div
            className={styles["error-box"] + " " + "text-center"}
        >
            <h3>Error</h3>
            <p>{error.message}</p>
        </div>
    );
}
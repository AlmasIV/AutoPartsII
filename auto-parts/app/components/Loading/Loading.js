import styles from "./loading.module.css";

export default function Loading(
    {
        size = "large",
        containerClass = ""
    }
) {
    return (
        <div
            className={styles[containerClass]}
        >
            <div
                className={`${styles["loading-spinner"]} ${styles[size]}`}
            ></div>
        </div>
    );
}
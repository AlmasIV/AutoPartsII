import styles from "./loading.module.css";

export default function Loading(
    {
        size = "large"
    }
) {
    return (
        <div
            className={`${styles["loading-spinner"]} ${styles[size]}`}
        ></div>
    );
}
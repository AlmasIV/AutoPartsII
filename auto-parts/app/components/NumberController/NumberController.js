import styles from "./number-controller.module.css";

export default function NumberController(
    {
        onIncrement,
        onDecrement,
        value
    }
) {
    return (
        <div
            className={styles["container"]}
        >
            <div
                className={`${styles["prev"]} ${styles["controller"]}`}
                onClick={onDecrement}
            >
                -
            </div>
            <div
                className={styles["amount-box"]}
            >
                {value}
            </div>
            <div
                className={`${styles["next"]} ${styles["controller"]}`}
                onClick={onIncrement}
            >
                +
            </div>
        </div>
    );
}
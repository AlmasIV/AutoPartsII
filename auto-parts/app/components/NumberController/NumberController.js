import styles from "./number-controller.module.css";

export default function NumberController(
    {
        updater,
        step,
        value,
        containerStyles = ""
    }
) {
    return (
        <div
            className={`${styles["container"]} ${containerStyles}`}
        >
            <div
                className={`${styles["prev"]} ${styles["controller"]}`}
                onClick={() => {
                    updater(value - step);
                }}
            >
                -
            </div>
            <div
                className={styles["amount-box"]}
            >
                <input
                    onChange={(e) => {
                        updater(e.currentTarget.value);
                    }}
                    value={value}
                    type="number"
                    step={step}
                />
            </div>
            <div
                className={`${styles["next"]} ${styles["controller"]}`}
                onClick={() => {
                    updater(value + step);
                }}
            >
                +
            </div>
        </div>
    );
}
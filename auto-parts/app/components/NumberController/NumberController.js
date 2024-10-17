import getInputValidator from "@/utils/validators/getInputValidator";
import styles from "./number-controller.module.css";

export default function NumberController(
    {
        onIncrement,
        onDecrement,
        value,
        max,
        min = 0,
        containerStyles = ""
    }
) {
    const validate = getInputValidator(
        {
            type: "number",
            min: min,
            max: max
        },
        
    );
    return (
        <div
            className={`${styles["container"]} ${containerStyles}`}
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
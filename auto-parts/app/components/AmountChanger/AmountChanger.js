import { setAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";
import styles from "./amount-changer.module.css";

export default function AmountChanger(
    {
        selectedAutoParts,
        setSelectedAutoParts,
        selectedAutoPart
    }
) {
    return (
        <div
            className={styles["container"]}
        >
            <div
                className={`${styles["prev"]} ${styles["controller"]}`}
                onClick={() => {
                    if(selectedAutoPart.selectedAmount > 1) {
                        const autoPart = {
                            ...selectedAutoPart,
                            amount: selectedAutoPart.amount + 1,
                            selectedAmount: selectedAutoPart.selectedAmount - 1
                        };
                        setAutoPart(autoPart);
                        setSelectedAutoParts(
                            [
                                ...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
                            ]
                        );
                    }
                }}
            >
                -
            </div>
            <div
                className={styles["amount-box"]}
            >
                {selectedAutoPart.selectedAmount}
            </div>
            <div
                className={`${styles["next"]} ${styles["controller"]}`}
                onClick={() => {
                    if(selectedAutoPart.amount > 0) {
                        const autoPart = {
                            ...selectedAutoPart,
                            amount: selectedAutoPart.amount - 1,
                            selectedAmount: selectedAutoPart.selectedAmount + 1
                        };
                        setAutoPart(autoPart);
                        setSelectedAutoParts(
                            [
                                ...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
                            ]
                        );
                    }
                }}
            >
                +
            </div>
        </div>
    );
}
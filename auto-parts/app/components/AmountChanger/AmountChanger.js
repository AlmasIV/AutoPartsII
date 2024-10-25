import { saveAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";
import { NumberController } from "@/app/components/Index.js";

export default function AmountChanger(
    {
        selectedAutoParts,
        setSelectedAutoParts,
        selectedAutoPart
    }
) {
    const maxAmount = selectedAutoPart.amount + selectedAutoPart.selectedAmount;
    function updateAmount(newAmount) {
        if(newAmount <= 0) {
            newAmount = 1;
        }
        else if(newAmount > maxAmount) {
            newAmount = maxAmount;
        }
        const autoPart = {
            ...selectedAutoPart,
            amount: maxAmount - newAmount,
            selectedAmount: newAmount
        };
        saveAutoPart(autoPart);
        setSelectedAutoParts(
            [
                ...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
            ]
        );
    }

    return (
        <NumberController
            updater={updateAmount}
            step={1}
            value={selectedAutoPart.selectedAmount}
        />
    );
}
import { setAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";
import { NumberController } from "@/app/components/Index.js";

export default function AmountChanger(
    {
        selectedAutoParts,
        setSelectedAutoParts,
        selectedAutoPart
    }
) {
    function onIncrement(){
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
    }

    function onDecrement(){
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
    }

    return (
        <NumberController
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            value={selectedAutoPart.selectedAmount}
        />
    );
}
import saveAutoPart from "@/global-utils/client-side-storage/saveAutoPart.js";
import { NumberController } from "@/app/components/Index.js";

export default function AmountChanger(
    {
        setSelectedAutoParts,
        selectedAutoPart
    }
) {
    const maxAmount = selectedAutoPart.amount + selectedAutoPart.selectedAmount;
    function updateAmount(newAmount) {
        newAmount = Math.max(1, Math.min(newAmount, maxAmount));
        const autoPart = {
            ...selectedAutoPart,
            amount: maxAmount - newAmount,
            selectedAmount: newAmount
        };
        saveAutoPart(autoPart);
        setSelectedAutoParts((prevAutoParts) => prevAutoParts.map((ap) => ap.id === autoPart.id ? autoPart : ap));
    }

    return (
        <NumberController
            updater={updateAmount}
            step={1}
            value={selectedAutoPart.selectedAmount}
        />
    );
}
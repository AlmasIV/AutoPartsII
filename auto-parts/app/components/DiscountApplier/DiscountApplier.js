"use client";

import { NumberController } from "@/app/components/Index.js";
import { setAutoPart } from "@/app/components/TableOfAutoParts/event-handlers/onSelect.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { useContext } from "react";
import generateGUID from "@/utils/GUID/GUID.js";

export default function DiscountApplier(
	{
		selectedAutoParts,
		setSelectedAutoParts,
		selectedAutoPart
	}
) {
	const globalNotification = useContext(NotificationBoxContext);
	function onIncrement() {
		if(selectedAutoPart.discountPercentage <= 100) {
			const autoPart = {
				...selectedAutoPart,
				discountPercentage: selectedAutoPart.discountPercentage + 1
			};
			setAutoPart(autoPart);
			setSelectedAutoParts(
				[
					...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
				]
			);
		}
		else {
			globalNotification.setNotifications(
				[
					{
						message: "The discount cannot be more than 100%.",
						level: "danger",
						key: generateGUID()
					},
					...globalNotification.notifications
				]
			);
		}
	}

	function onDecrement() {
		if(selectedAutoPart.discountPercentage >= 1) {
			const autoPart = {
				...selectedAutoPart,
				discountPercentage: selectedAutoPart.discountPercentage - 1
			};
			setAutoPart(autoPart);
			setSelectedAutoParts(
				[
					...[...selectedAutoParts.filter((ap) => ap.id !== autoPart.id), autoPart].sort((a, b) => a.id - b.id)
				]
			);
		}
		else {
			globalNotification.setNotifications(
				[
					{
						message: "The discount cannot be less than 0%.",
						level: "danger",
						key: generateGUID()
					},
					...globalNotification.notifications
				]
			);
		}
	}

	return (
		<NumberController
			onIncrement={onIncrement}
			onDecrement={onDecrement}
			value={selectedAutoPart.discountPercentage}
			valuePostFix="%"
		/>
	);
}
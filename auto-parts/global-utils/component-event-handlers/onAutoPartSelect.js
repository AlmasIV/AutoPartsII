"use client";

import deSelectAutoPart from "@/global-utils/client-side-storage/deSelectAutoPart.js";
import selectAutoPart from "@/global-utils/client-side-storage/selectAutoPart.js";

export default function onAutoPartSelect(selectedState, globalNotification, autoPart) {
	if(localStorage.getItem(autoPart.id + "ap")) {
		deSelectAutoPart(autoPart, selectedState, globalNotification);
	}
	else {
		selectAutoPart(autoPart, selectedState, globalNotification);
	}
}
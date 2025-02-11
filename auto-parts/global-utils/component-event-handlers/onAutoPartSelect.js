"use client";

import deSelectAutoPart from "@/global-utils/shopping-cart-manipulation/deSelectAutoPart.js";
import selectAutoPart from "@/global-utils/shopping-cart-manipulation/selectAutoPart.js";

export default function onAutoPartSelect(selectedState, globalNotification, autoPart) {
	if(localStorage.getItem(autoPart.id + "ap")) {
		deSelectAutoPart(autoPart, selectedState, globalNotification);
	}
	else {
		selectAutoPart(autoPart, selectedState, globalNotification);
	}
}
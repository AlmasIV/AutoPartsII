import { useState, useEffect } from "react";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";

export default function useLocalStoragePage(localStorageKey) {
	const [selectedPage, setSelectedPage] = useState(1);

	useEffect(() => {
		const sp = localStorage.getItem(localStorageKey);
		if(canBeCastedToPositiveInteger(sp)) {
			setSelectedPage(sp);
		}
	}, [localStorageKey]);

	return { selectedPage, setSelectedPage };
}
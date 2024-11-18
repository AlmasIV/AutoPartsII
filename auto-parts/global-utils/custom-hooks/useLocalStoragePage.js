import { useState, useEffect } from "react";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";

export default function useLocalStoragePage(localStorageKey) {
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		const selectedPage = localStorage.getItem(localStorageKey);
		if(canBeCastedToPositiveInteger(selectedPage)) {
			setPageNumber(selectedPage);
		}
	}, [localStorageKey]);

	return { pageNumber, setPageNumber };
}
import { useState, useEffect } from "react";
import isPositiveInteger from "@/global-utils/validators/isPositiveInteger.js";

export default function useLocalStoragePage(localStorageKey) {
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		const selectedPage = localStorage.getItem(localStorageKey);
		if(isPositiveInteger(selectedPage)) {
			setPageNumber(selectedPage);
		}
	}, [localStorageKey]);

	return { pageNumber, setPageNumber };
}
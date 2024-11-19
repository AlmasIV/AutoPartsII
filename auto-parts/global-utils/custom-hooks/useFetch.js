import { useState, useEffect } from "react";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";

export default function useFetch(url) {
	const [data, setData] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		const fetchData = async () => {
			setError(null);
			setIsPending(true);
			try {
				const response = await fetch(url, {
					signal: abortController.signal
				});
				redirectIfCan(response);
				const bodyData = await response.json();
				if(!response.ok) {
					setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
					return;
				}
				setData(bodyData.data);
			}
			catch(error) {
				if(error.name !== "AbortError") {
					setError(new Error("Something went wrong."));
				}
			}
			finally {
				setIsPending(false);
			}
		};
		fetchData();
		return () => abortController.abort();
	}, [url]);

	return { data, setData, isPending, error };
}
"use client";

import { OrdersStateContext } from "@/app/components/Orders/OrdersStateContext";
import { useState, useEffect } from "react";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger";
import { Loading, ErrorBox } from "@/app/components/Index";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan.js";

export default function MainFunctionalityLayout(
	{
		children
	}
) {
	const [orders, setOrders] = useState([]);
	const [selectedPage, setSelectedPage] = useState(1);
	const [totalOrders, setTotalOrders] = useState(0);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const orderPage = Number(localStorage.getItem("orderPageNum"));
		if(isPositiveInteger(orderPage)) {
			setSelectedPage(orderPage);
		}
	});

	useEffect(() => {
		const abortController = new AbortController();
		const fetchCount = async () => {
			setError(null);
			try {
				const response = await fetch("/api/authenticated/orders/count", {
					signal: abortController.signal
				});
				redirectIfCan(response);
				const bodyData = await response.json();
				if(!response.ok) {
					setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
					return;
				}
				setTotalOrders(bodyData.data);
			}
			catch(error) {
				if(error.name !== "AbortError") {
					setError(new Error("Something went wrong."));
				}
			}
			finally {
				setIsLoading(false);
			}
		};

		fetchCount();

		return () => abortController.abort();
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		async function fetchOrders() {
			setError(null);
			try {
				const response = await fetch(`/api/authenticated/orders/pages/${selectedPage}`, {
					signal: abortController.signal
				});
				redirectIfCan(response);
				const bodyData = await response.json();
				if(!response.ok) {
					setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
					return;
				}
				setOrders(bodyData.data);
			}
			catch(error) {
				if(error.name !== "AbortError") {
					setError(new Error("Something went wrong."));
				}
			}
			finally {
				setIsLoading(false);
			}
		}

		fetchOrders();

		return () => abortController.abort();
	}, [selectedPage]);
	return (
		<OrdersStateContext.Provider
			value={
				{
					orders,
					selectedPage,
					setSelectedPage,
					totalOrders
				}
			}
		>
			{
				isLoading && !error ? <Loading /> : error ?
					<ErrorBox
						error={error}
					/> : children
			}
		</OrdersStateContext.Provider>
	);
}
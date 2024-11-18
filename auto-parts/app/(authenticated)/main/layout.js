"use client";

import { OrdersStateContext } from "@/app/components/Orders/OrdersStateContext.js";
import { useState, useEffect } from "react";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import { Loading, ErrorBox } from "@/app/components/Index.js";
import useFetch from "@/global-utils/custom-hooks/useFetch.js";
import useLocalStoragePage from "@/global-utils/custom-hooks/useLocalStoragePage";

export default function MainFunctionalityLayout(
	{
		children
	}
) {
	const {
		pageNumber: selectedPage,
		setPageNumber: setSelectedPage
	} = useLocalStoragePage("orderPageNum");

	const {
		data: orders,
		setData: setOrders,
		isPending: isOrdersPending,
		error: ordersFetchError
	} = useFetch(`/api/authenticated/orders/pages/${selectedPage}`);

	const {
		data: totalOrdersCount,
		setData: setTotalOrdersCount,
		isPending: isTotalOrdersCountPending,
		error: totalOrdersCountFetchError
	} = useFetch("/api/authenticated/orders/count");

	const isPending = isOrdersPending || isTotalOrdersCountPending;
	const error = ordersFetchError || totalOrdersCountFetchError;

	return (
		<OrdersStateContext.Provider
			value={
				{
					orders,
					setOrders,
					selectedPage,
					setSelectedPage,
					totalOrdersCount,
					setTotalOrdersCount
				}
			}
		>
			{
				isPending ? <Loading /> : error ? (
					<ErrorBox
						error={ordersFetchError || totalOrdersCountFetchError}
					/>
				) : children
			}
		</OrdersStateContext.Provider>
	);
}
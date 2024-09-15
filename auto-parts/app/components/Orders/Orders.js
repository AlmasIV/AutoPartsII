"use client";

import { Fragment, useEffect, useState } from "react";
import { OrderModal, ErrorBox, Loading, PageSelector } from "@/app/components/Index.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger";

/*
    useEffects are updating the same error state. Maybe I shall define an error  state for each useEffect? But the current state provides a simple solution, and a generic error.
*/

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const orderPage = Number(localStorage.getItem("orderPageNum"));
        if(isPositiveInteger(orderPage)) {
            setSelectedPage(orderPage);
        }
    }, []);

    useEffect(() => {
        let isIgnore = false;
        async function fetchOrders() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/authenticated/orders/pages/${selectedPage}`);
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
                }
                if(!isIgnore) {
                    setOrders(bodyData.data);
                }
            }
            catch(error) {
                setError(new Error("Something went wrong."));
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchOrders();

        return () => { isIgnore = true; };
    }, [selectedPage]);

    useEffect(() => {
        let isIgnore = false;
        const fetchCount = async () => {
            setError(null);
            try {
                const response = await fetch("/api/authenticated/orders/count");
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
                }
                setTotalOrders(bodyData.data);
            }
            catch(error) {
                setError(new Error("Something went wrong."));
            }
        };

        fetchCount();

        return () => { isIgnore = true };
    }, []);

    return (
        <div>
            <h2
                className="text-center opacity-08"
            >
                Order History
            </h2>
            {
                error ? (
                    <ErrorBox
                        error={error}
                    />
                ) : isLoading ? (
                    <Loading />
                ) : orders.length > 0 ? (
                    <Fragment>
                        {
                            orders.map((o) => {
                                return (
                                    <OrderModal
                                        key={o.id}
                                        order={o}
                                    />
                                );
                            })
                        }
                        <PageSelector
                            count={totalOrders}
                            selected={selectedPage}
                            setSelected={setSelectedPage}
                            selectorType="orderPageNum"
                        />
                    </Fragment>
                ) : (
                    <h3
                        className="text-center"
                    >
                        You don't have any order history.
                    </h3>
                )
            }
        </div>
    );
}
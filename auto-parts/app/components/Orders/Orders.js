"use client";

import { useEffect, useState } from "react";
import { OrderModal, ErrorBox, Loading } from "@/app/components/Index.js";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        async function fetchOrders() {
            setIsLoading(true);
            try {
                const result = await fetch("/api/authenticated/orders/all");
                if(result.redirected){
                    window.location.href = result.url;
                    return;
                }
                if (!result.ok) {
                    setError(new Error("Something went wrong."));
                }
                const fetchedOrders = await result.json();
                if (!ignore) {
                    setOrders(fetchedOrders.data);
                }
            }
            catch (error) {
                setError(new Error("Something went wrong."));
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchOrders();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div>
            <h2
                className="text-center opacity-08"
            >
                Order History
            </h2>
            {error ? (
                <ErrorBox
                    error={error}
                />
            ) : isLoading ? (
                <Loading />
            ) : orders.length > 0 ? (
                <div>
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
                </div>
            ) : (
                <h3
                    className="text-center"
                >
                    You don't have any order history.
                </h3>
            )}
        </div>
    );
}
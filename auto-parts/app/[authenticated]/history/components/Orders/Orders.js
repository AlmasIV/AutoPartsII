"use client";

import { useEffect, useState } from "react";
import { OrderModal, ErrorBox } from "@/app/[authenticated]/history/components/Index.js";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        async function fetchOrders() {
            setIsLoading(true);
            try {
                const result = await fetch("https://localhost:7019/auto-parts/orders/all");
                if (!result.ok) {
                    throw new Error("Failed to fetch the data. The server might be down.");
                }
                const fetchedOrders = await result.json();
                if (!ignore) {
                    setOrders(fetchedOrders);
                }
            }
            catch (error) {
                setError(error);
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
                <div>Loading...</div>
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
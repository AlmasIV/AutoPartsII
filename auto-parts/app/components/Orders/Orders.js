"use client";

import { Fragment, useContext } from "react";
import { OrderModal, PageSelector } from "@/app/components/Index.js";
import { OrdersStateContext } from "./OrdersStateContext.js";

/*
    useEffects are updating the same error state. Maybe I shall define an error  state for each useEffect? But the current state provides a simple solution, and a generic error.
*/

export default function Orders() {
    const { orders, selectedPage, setSelectedPage, totalOrders } = useContext(OrdersStateContext);

    return (
        <div>
            <h2
                className="text-center opacity-08"
            >
                Order History
            </h2>
            {
                orders.length > 0 ? (
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
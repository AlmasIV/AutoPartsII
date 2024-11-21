"use client";

import { Fragment, useContext } from "react";
import { OrderModal, PageSelector } from "@/app/components/Index.js";
import { OrdersStateContext } from "./OrdersStateContext.js";

export default function Orders() {
    const { orders, selectedPage, setSelectedPage, totalOrdersCount } = useContext(OrdersStateContext);

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
                            count={totalOrdersCount}
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
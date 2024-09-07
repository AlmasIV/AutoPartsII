"use client";

import { Fragment, useRef, useState } from "react";
import { LocalDataFormatter } from "@/utils/dateFormatters/LocalDateFormatter.js";
import { ErrorBox, Loading, OrderDetails } from "@/app/components/Index.js";
import { Button } from "@/app/components/Index.js";
import styles from "./order-modal.module.css";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan";

export default function OrderModal(
    {
        order
    }
) {
    const modalRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);
    async function fetchDetails() {
        if(!details) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/authenticated/orders/${order.id}`);
                redirectIfCan(response);
                if(!response.ok) {
                    setError(new Error(response.message || `${response.status} ${response.statusText}`));
                }
                else {
                    const details = await response.json();
                    setDetails(details.data);
                }
            }
            catch(error) {
                setError(new Error("Something went wrong."));
            }
            finally {
                setIsLoading(false);
            }
        }
    }
    return (
        <Fragment>
            <dialog
                ref={modalRef}
                className={styles["order-details"]}
            >
                <h2
                    className="text-center margin-top-05rem"
                >
                    Order ID: {order.id}
                </h2>
                <div
                    className="flex-container flex-column space-between overflow-auto"
                >
                    {
                        error ? (
                            <ErrorBox
                                error={error}
                            />
                        ) : isLoading ? (<Loading />) : (
                            <OrderDetails
                                details={details}
                            />
                        )
                    }
                    <Button
                        title="Close"
                        className="primary-btn width-full margin-top-2rem"
                        type="button"
                        onClick={() => {
                            modalRef.current.close();
                        }}
                    />
                </div>
            </dialog>
            <div
                className={styles["order-box"]}
                onClick={async () => {
                    await fetchDetails();
                    modalRef.current.showModal();
                }}
            >
                <p>
                    <span
                        className="opacity-08"
                    >
                        ID:
                    </span> {order.id}
                </p>
                <p>
                    <span
                        className="opacity-08"
                    >
                        Date:
                    </span> {LocalDataFormatter.format(new Date(order.createdOn))}
                </p>
                <p>
                    <span
                        className="opacity-08"
                    >
                        Total price in tenge:
                    </span> {order.totalPriceInKzt}
                </p>
            </div>
        </Fragment>
    );
}
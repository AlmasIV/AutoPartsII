"use client";

import { Fragment, useRef, useState } from "react";
import { LocalDataFormatter } from "@/tools/DateFormatters/LocalDateFormatter.js";
import { ErrorBox, OrderDetails } from "@/app/components/Index.js";
import { Button } from "@/app/components/Index.js";
import styles from "./order-modal.module.css";

export default function OrderModal(
    {
        order
    }
) {
    const modalRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);
    async function fetchDetails(){
        if(!details){
            try {
                setIsLoading(true);
                const result = await fetch(`https://localhost:7019/auto-parts/orders/${order.id}`);
                if(!result.ok){
                    throw new Error("Couldn't make the request.");
                }
                const details = await result.json();
                setDetails(details);
            }
            catch(error) {
                setError(error);
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
                    className={styles["order-flex"]}
                >
                    {
                        error ? (
                            <ErrorBox
                                error={error}
                            />
                        ) : isLoading ? (<p>Loading...</p>) : (
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
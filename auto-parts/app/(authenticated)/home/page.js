"use client";

import { Fragment, useState, useEffect } from "react";
import { TableOfAutoParts, Modal, AutoPartForm, ShoppingCart, Loading, ErrorBox } from "@/app/components/Index.js";
import onCreate from "@/app/components/AutoPartForm/event-handlers/onCreate.js";

export default function HomePage() {
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    const [autoParts, setAutoParts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await fetch("/api/authenticated/auto-parts/all");
                if(result.redirected){
                    window.location.href = result.url;
                    return;
                }
                const response = await result.json();
                if (!result.ok) {
                    setError(new Error(response.message))
                }
                else {
                    setAutoParts(response.data);
                }
            } catch (error) {
                setError(new Error("Something went wrong."));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const selected = [];
        let i = 0;
        let ap = null;
        for (i; i < localStorage.length; i++) {
            ap = localStorage.key(i);
            if (ap.includes("ap")) {
                selected.push(JSON.parse(localStorage.getItem(ap)));
            }
        }
        setSelectedAutoParts([...selected]);
    }, []);
    return (
        <Fragment>
            <div
                className="flex-container width-full"
            >
                <Modal
                    openButtonTitle="Create"
                    closeButtonTitle="Close"
                    openButtonClass={`${(error || isLoading) ? "disabled-btn" : "primary-btn"} width-full margin-bottom-05rem`}
                    closeButtonClass="secondary-btn width-full margin-top-05rem"
                    dialogType="form-modal"
                    isDisabled={error || isLoading}
                    containerClass="flex-grow-1"
                >
                    <AutoPartForm
                        formTitle="Create a new auto-part"
                        submitButtonTitle="Create"
                        onSubmit={onCreate}
                        autoPartsState={{ autoParts, setAutoParts }}
                    />
                </Modal>
                <Modal
                    openButtonTitle="Shopping Cart"
                    closeButtonTitle="Exit"
                    openButtonClass={`${(error || isLoading) ? "disabled-btn" : "informational-btn"} width-full margin-bottom-05rem`}
                    closeButtonClass="secondary-btn width-full margin-top-05rem"
                    dialogType="shopping-cart-modal"
                    isDisabled={error || isLoading}
                    containerClass="flex-grow-1"
                >
                    <ShoppingCart
                        selectedAutoParts={selectedAutoParts}
                        setSelectedAutoParts={setSelectedAutoParts}
                        autoParts={autoParts}
                        setAutoParts={setAutoParts}
                    />
                </Modal>
            </div>
            <Fragment>
                {
                    isLoading ? <Loading /> : error ? 
                    <ErrorBox
                        error={error}
                        errorBoxClassName="margin-top-2rem"
                    /> : autoParts.length > 0 ? 
                    (
                        <div
                            className="width-full overflow-auto"
                        >
                            <TableOfAutoParts
                                autoPartCollection={autoParts}
                                selectedAutoParts={selectedAutoParts}
                                setSelectedAutoParts={setSelectedAutoParts}
                            />
                        </div>
                    ) : (
                        <p
                            className="text-center margin-top-2rem"
                        >
                            You don't have any data.
                        </p>
                    )
                }
            </Fragment>
        </Fragment>
    );
}
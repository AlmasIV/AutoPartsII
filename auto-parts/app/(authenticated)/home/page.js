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
            setError(null); // Clear any previous errors
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
            <Modal
                openButtonTitle="Create"
                closeButtonTitle="Close"
                openButtonClass={`${(error || isLoading) ? "disabled-btn" : "primary-btn"} width-half float-right margin-bottom-05rem`}
                closeButtonClass="secondary-btn width-full margin-top-05rem"
                dialogType="form-modal"
                dialogClass={null}
                onOpenButtonClick={null}
                onCloseButtonClick={null}
                isDisabled={error || isLoading}
            >
                <AutoPartForm
                    formTitle="Create a new auto-part"
                    submitButtonTitle="Create"
                    onSubmit={onCreate}
                    autoPartsState={{ autoParts, setAutoParts }}
                    autoPart={null}
                />
            </Modal>
            <Modal
                openButtonTitle="Shopping Cart"
                closeButtonTitle="Exit"
                openButtonClass={`${(error || isLoading) ? "disabled-btn" : "informational-btn"} width-half margin-bottom-05rem`}
                closeButtonClass="secondary-btn width-full margin-top-05rem"
                dialogType="shopping-cart-modal"
                dialogClass={null}
                onOpenButtonClick={null}
                onCloseButtonClick={null}
                isDisabled={error || isLoading}
            >
                <ShoppingCart
                    selectedAutoParts={selectedAutoParts}
                    setSelectedAutoParts={setSelectedAutoParts}
                    autoParts={autoParts}
                    setAutoParts={setAutoParts}
                />
            </Modal>
            <div>
                {
                    isLoading ? <Loading /> : error ? 
                    <ErrorBox
                        error={error}
                        errorBoxClassName="margin-top-2rem"
                    /> : autoParts.length > 0 ? 
                    (<TableOfAutoParts
                        autoPartCollection={autoParts}
                        selectedAutoParts={selectedAutoParts}
                        setSelectedAutoParts={setSelectedAutoParts}
                    />) : (
                        <p
                            className="text-center margin-top-2rem"
                        >
                            You don't have any data.
                        </p>
                    )
                }
            </div>
        </Fragment>
    );
}
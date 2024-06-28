"use client";

import { Fragment, useState, useEffect } from "react";
import { TableOfAutoParts, Modal, AutoPartForm, ShoppingCart, Loading, ErrorBox, PageSelector } from "@/app/components/Index.js";
import onCreate from "@/app/components/AutoPartForm/event-handlers/onCreate.js";

export default function HomePage() {
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    const [autoParts, setAutoParts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAutoParts, setTotalAutoParts] = useState(0);
    const [selected, setSelected] = useState(1);

    useEffect(() => {
        const selectedPage = Number(localStorage.getItem("pageNum"));
        if(Number.isInteger(selectedPage) && selectedPage > 1) {
            setSelected(selectedPage);
        }
    }, []);

    useEffect(() => {
        let isIgnore = false;
        const fetchPage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await fetch(`/api/authenticated/auto-parts/${selected}`);
                if(result.redirected) {
                    window.location.href = result.url;
                    return;
                }
                const response = await result.json();
                if(!result.ok) {
                    setError(new Error(response.message));
                }
                else if(!isIgnore) {
                    setAutoParts(response.data);
                }
            }
            catch(error) {
                setError(new Error("Something went wrong."));
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchPage();

        return () => { isIgnore = true; };
    }, [selected]);

    useEffect(() => {
        const selectedParts = [];
        let i = 0;
        let ap = null;
        for(i; i < localStorage.length; i++) {
            ap = localStorage.key(i);
            if(ap.includes("ap")) {
                selectedParts.push(JSON.parse(localStorage.getItem(ap)));
            }
        }
        setSelectedAutoParts([...selectedParts]);
    }, []);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const result = await fetch("/api/authenticated/auto-parts/count");
                if(result.redirected) {
                    location.href = result.url;
                }
                if(!result.ok) {
                    throw new Error("Couldn't get the total number of auto-parts.");
                }
                const totalNum = await result.json();
                setTotalAutoParts(totalNum.data);
            }
            catch(error) {
                console.log(error);
            }
        };

        fetchCount();
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
                        autoPartsState={{ autoParts, setAutoParts, setTotalAutoParts }}
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
                                <Fragment>
                                    <div
                                        className="width-full overflow-auto"
                                    >
                                        <TableOfAutoParts
                                            autoPartCollection={autoParts}
                                            selectedAutoParts={selectedAutoParts}
                                            setSelectedAutoParts={setSelectedAutoParts}
                                        />
                                    </div>
                                    <PageSelector
                                        count={totalAutoParts}
                                        selected={selected}
                                        setSelected={setSelected}
                                        selectorType="pageNum"
                                    />
                                </Fragment>
                            ) : (
                                <p
                                    className="text-center margin-top-2rem"
                                >
                                    You don&apos;t have any data.
                                </p>
                            )
                }
            </Fragment>
        </Fragment>
    );
}
"use client";

import { Fragment, useState, useEffect } from "react";
import { TableOfAutoParts, Modal, AutoPartForm, ShoppingCart, Loading, ErrorBox, PageSelector } from "@/app/components/Index.js";
import onCreate from "@/app/components/AutoPartForm/event-handlers/onCreate.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan.js";

export default function HomePage() {
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    const [autoParts, setAutoParts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAutoParts, setTotalAutoParts] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);

    useEffect(() => {
        const sp = Number(localStorage.getItem("pageNum"));
        /*
            1) Maybe add a config file that sets the total product count displayed on the page? If so we need to create some kind of configuration mechanism. We could limit the upper bound for the "pageNum".
        */
        if(Number.isInteger(sp) && sp > 1) {
            setSelectedPage(sp);
        }
    }, []);

    useEffect(() => {
        let isIgnore = false;
        const fetchPage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/authenticated/auto-parts/page/${selectedPage}`);
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.message || `${response.status} ${response.statusText}`));
                }
                else if(!isIgnore) {
                    setAutoParts(bodyData.data);
                }
            }
            catch(error) {
                setError(new Error("Something went wrong. The requested page couldn't load."));
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchPage();

        return () => { isIgnore = true; };
    }, [selectedPage]);

    useEffect(() => {
        setSelectedAutoParts(
            Object.keys(localStorage)
                .filter(key => key.includes("ap"))
                .map(key => JSON.parse(localStorage.getItem(key)))
        );
    }, []);

    useEffect(() => {
        let isIgnore = false;
        const fetchCount = async () => {
            try {
                const response = await fetch("/api/authenticated/auto-parts/count");
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
                }
                else if(!isIgnore){
                    setTotalAutoParts(bodyData.data);
                }
            }
            catch(error) {
                setError(new Error("Couldn't get the total number of auto-parts."));
            }
        };

        fetchCount();

        return () => { isIgnore = true };
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
                    openButtonClass={`${(error || isLoading) ? "disabled-btn" : "primary-btn"} width-full margin-bottom-05rem`}
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
                                        selected={selectedPage}
                                        setSelected={setSelectedPage}
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
"use client";

import { Fragment, useState, useEffect } from "react";
import { TableOfAutoParts, Modal, AutoPartForm, ShoppingCart, Loading, ErrorBox, PageSelector } from "@/app/components/Index.js";
import onCreate from "@/app/components/AutoPartForm/event-handlers/onCreate.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import useFetch from "@/global-utils/custom-hooks/useFetch.js";

export default function HomePage() {
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);

    useEffect(() => {
        const sp = localStorage.getItem("pageNum");
        /*
            1) Maybe add a config file that sets the total product count displayed on the page? If so we need to create some kind of configuration mechanism. We could limit the upper bound for the "pageNum".
        */
        if(canBeCastedToPositiveInteger(sp)) {
            setSelectedPage(sp);
        }
    }, []);

    useEffect(() => {
        setSelectedAutoParts(
            Object.keys(localStorage)
                .filter(key => key.includes("ap"))
                .map(key => JSON.parse(localStorage.getItem(key)))
        );
    }, []);

    const {
        data: autoParts,
        setData: setAutoParts,
        isPending: isAutoPartsPending,
        error: autoPartsFetchError
    } = useFetch(`/api/authenticated/auto-parts/page/${selectedPage}`);

    const {
        data: totalAutoParts,
        setData: setTotalAutoParts,
        isPending: isTotalAutoPartsPending,
        error: totalAutoPartsFetchError
    } = useFetch("/api/authenticated/auto-parts/count");

    const error = autoPartsFetchError || totalAutoPartsFetchError;
    const isPending = isAutoPartsPending || isTotalAutoPartsPending;

    return (
        <Fragment>
            <div
                className="flex-container width-full"
            >
                <Modal
                    openButtonTitle="Create"
                    closeButtonTitle="Close"
                    openButtonClass={`${(error || isPending) ? "disabled-btn" : "primary-btn"} width-full margin-bottom-05rem`}
                    closeButtonClass="secondary-btn width-full margin-top-05rem"
                    dialogType="form-modal"
                    isDisabled={error || isPending}
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
                    openButtonClass={`${(error || isPending) ? "disabled-btn" : "primary-btn"} width-full margin-bottom-05rem`}
                    closeButtonClass="secondary-btn width-full margin-top-05rem"
                    dialogType="shopping-cart-modal"
                    isDisabled={error || isPending}
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
                    isPending ? <Loading /> : error ?
                        <ErrorBox
                            error={autoPartsFetchError || totalAutoPartsFetchError}
                            errorBoxClassName="margin-top-2rem"
                        /> : autoParts?.length > 0 ?
                            (
                                <Fragment>
                                    <div
                                        className="width-full overflow-auto"
                                    >
                                        <TableOfAutoParts
                                            autoPartsState={{ autoParts, setAutoParts }}
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
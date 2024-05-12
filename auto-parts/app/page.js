"use client";

import { Fragment, useState, useEffect } from "react";
import { Catalog, Modal, AutoPartForm, ShoppingCart } from "./components/Index.js";
import onCreate from "./components/AutoPartForm/event-handlers/onCreate.js";

export default function HomePage(){
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    useEffect(() => {
        const selected = [];
        let i = 0;
        let ap = null;
        for(i; i < localStorage.length; i ++){
            ap = localStorage.key(i);
            if(ap.includes("ap")){
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
                dialogType="form-modal"
                openButtonClass="primary-btn width-half float-right margin-bottom-05rem"
                closeButtonClass="secondary-btn width-full margin-top-05rem"
            >
                <AutoPartForm
                    formTitle="Create a new auto-part"
                    submitButtonTitle="Create"
                    onSubmit={onCreate}
                />
            </Modal>
            <Modal
                openButtonTitle="Shopping Cart"
                closeButtonTitle="Exit"
                dialogType="shopping-cart-modal"
                openButtonClass="informational-btn width-half margin-bottom-05rem"
                closeButtonClass="secondary-btn width-full margin-top-05rem"
            >
                <ShoppingCart
                    selectedAutoParts={selectedAutoParts}
                    setSelectedAutoParts={setSelectedAutoParts}
                />
            </Modal>
            <Catalog
                selectedAutoParts={selectedAutoParts}
                setSelectedAutoParts={setSelectedAutoParts}
            />
        </Fragment>
    ); 
}
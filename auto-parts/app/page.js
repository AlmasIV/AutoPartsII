"use client";

import { Fragment, useState, useEffect } from "react";
import { TableOfAutoParts, Modal, AutoPartForm, ShoppingCart } from "./components/Index.js";
import onCreate from "./components/AutoPartForm/event-handlers/onCreate.js";

export default function HomePage(){
    const [selectedAutoParts, setSelectedAutoParts] = useState([]);
    const [autoParts, setAutoParts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null); // Clear any previous errors
            try {
                const result = await fetch("https://localhost:7019/auto-parts/all");
                if (!result.ok) {
                    throw new Error("Failed to fetch all auto parts.");
                }
                const fetchedAutoParts = await result.json();
                setAutoParts(fetchedAutoParts);
            } catch (error) {
                setError(error.message);
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
                    autoParts={autoParts}
                    setAutoParts={setAutoParts}
                />
            </Modal>
            <div>
                {isLoading && <p>Loading auto parts...</p>}
                {error && <p>Error: {error}</p>}
                {autoParts.length > 0 && <TableOfAutoParts autoPartCollection={autoParts} selectedAutoParts={selectedAutoParts} setSelectedAutoParts={setSelectedAutoParts} />}
            </div>
        </Fragment>
    ); 
}
"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "@/app/components/Index.js";
import generateGUID from "@/global-utils/GUID/generateGUID.js";

export default function PageSelector(
    {
        count,
        selected,
        setSelected,
        selectorType
    }
) {
    const [totalPages, setTotalPages] = useState(Math.ceil(count / 100));

    useEffect(() => {
        const totPages = Math.ceil(count / 100);
        if(totPages > totalPages) {
            setTotalPages(totPages);
        }
    }, [count]);

    function changePage(page) {
        setSelected(page);
        localStorage.setItem(selectorType, page);
    }
    return (
        <div
            className={"space-between width-full flex-container margin-top-2rem"}
        >
            <Button
                title="first"
                className={`${selected === 1 ? "disabled-btn" : "secondary-btn"}`}
                type="button"
                onClick={() => changePage(1)}
                isDisabled={selected === 1}
            />
            <Button
                title="prev"
                className={`${selected === 1 ? "disabled-btn" : "secondary-btn"}`}
                type="button"
                onClick={() => changePage(selected - 1)}
                isDisabled={selected === 1}
            />
            <Modal
                openButtonTitle="select"
                closeButtonTitle="cancel"
                openButtonClass="secondary-btn"
                closeButtonClass="secondary-btn width-full margin-top-05rem"
                dialogType="shopping-cart-modal"
                isDisabled={count % 100 === 0}
            >
                <div
                    className="flex-container space-around flex-wrap"
                >
                    {
                        Array.from({ length: totalPages }, (_, index) => {
                            return (
                                <Button
                                    key={generateGUID()}
                                    title={index + 1}
                                    className={`${selected === index + 1 ? "disabled-btn" : "secondary-btn"}`}
                                    type="button"
                                    onClick={() => changePage(index + 1)}
                                    isDisabled={selected === index + 1}
                                />
                            );
                        })
                    }
                </div>
            </Modal>
            <Button
                title="next"
                className={`${selected === totalPages ? "disabled-btn" : "secondary-btn"}`}
                type="button"
                onClick={() => changePage(selected + 1)}
                isDisabled={selected === totalPages}
            />
            <Button
                title="last"
                className={`${selected === totalPages ? "disabled-btn" : "secondary-btn"}`}
                type="button"
                onClick={() => changePage(totalPages)}
                isDisabled={selected === totalPages}
            />
        </div>
    );
}
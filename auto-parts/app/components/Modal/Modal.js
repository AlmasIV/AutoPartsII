"use client";

import { Fragment, useRef } from "react";
import styles from "./modal.module.css";
import { Button } from "../Index.js";

export default function Modal(
    {
        children,
        openButtonTitle,
        closeButtonTitle,
        openButtonClass,
        closeButtonClass,
        dialogType,
        dialogClass="",
        onOpenButtonClick=null,
        onCloseButtonClick=null
    }
){
    const modalRef = useRef(null);
    return (
        <Fragment>
            <dialog
                ref={modalRef}
                className={styles[dialogType] + " " + dialogClass}
            >
                {children}
                <Button
                    title={closeButtonTitle}
                    className={closeButtonClass}
                    type="button"
                    onClick={() => {
                        modalRef.current.close();
                        onCloseButtonClick && onCloseButtonClick();
                    }}
                />
            </dialog>
            <Button
                title={openButtonTitle}
                className={openButtonClass}
                type="button"
                onClick={() => {
                    modalRef.current.showModal();
                    onOpenButtonClick && onOpenButtonClick();
                }}
            />
        </Fragment>
    );
}
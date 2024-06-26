"use client";

import { useRef } from "react";
import { Button } from "@/app/components/Index.js";
import styles from "./modal.module.css";

export default function Modal(
    {
        children,
        openButtonTitle,
        closeButtonTitle,
        openButtonClass,
        closeButtonClass,
        dialogType,
        dialogClass = "",
        onOpenButtonClick = null,
        onCloseButtonClick = null,
        isDisabled = false,
        containerClass = ""
    }
) {
    const modalRef = useRef(null);
    return (
        <div
            className={containerClass}
        >
            <dialog
                ref={modalRef}
                className={`${styles[dialogType]} ${dialogClass}`}
            >
                {children}
                <Button
                    title={closeButtonTitle}
                    className={closeButtonClass}
                    type="button"
                    isDisabled={isDisabled}
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
                isDisabled={isDisabled}
                onClick={() => {
                    modalRef.current.showModal();
                    onOpenButtonClick && onOpenButtonClick();
                }}
            />
        </div>
    );
}
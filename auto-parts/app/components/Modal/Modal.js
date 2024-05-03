"use client";

import { Fragment, useRef } from "react";
import styles from "./modal.module.css";

export default function Modal({ children, openTitle, closeTitle }){
    const modalRef = useRef(null);
    return (
        <Fragment>
            <dialog
                ref={modalRef}
                id={styles["primary-modal"]}
            >
                {children}
                <button
                    type="button"
                    className="secondary-btn width-full margin-top-05rem"
                    onClick={() => modalRef.current.close()}
                >
                    {closeTitle}
                </button>
            </dialog>
            <button
                className="primary-btn width-full margin-bottom-05rem"
                onClick={() => modalRef.current.showModal()}
            >
                {openTitle}
            </button>
        </Fragment>
    );
}
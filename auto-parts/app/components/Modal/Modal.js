"use client";

import { Fragment, useRef } from "react";
import styles from "./modal.module.css";
import { Button } from "../Index.js";

export default function Modal({ children, openTitle, closeTitle }){
    const modalRef = useRef(null);
    return (
        <Fragment>
            <dialog
                ref={modalRef}
                id={styles["primary-modal"]}
            >
                {children}
                <Button
                    type="button"
                    title={closeTitle}
                    className="secondary-btn width-full margin-top-05rem"
                    onClick={() => modalRef.current.close()}
                />
            </dialog>
            <Button
                type="button"
                title={openTitle}
                className="primary-btn width-full margin-bottom-05rem"
                onClick={() => modalRef.current.showModal()}
            />
        </Fragment>
    );
}
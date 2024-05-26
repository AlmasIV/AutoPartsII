"use client";

import { Input, Form, Modal, Button } from "@/app/components/Index.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import styles from "@/app/components/Authentication/authentication.module.css";
import userConfigs from "@/configurations/user-configuration.json";
import { useState, useContext } from "react";
import generateGUID from "@/tools/GUID/GUID.js";
import onSignUpSubmit from "./event-handlers/onSignUpSubmit.js";

export default function Authentication() {
    const globalNotification = useContext(NotificationBoxContext);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    async function onLogInSubmit(event) {
        if (!isSending) {
            event.preventDefault();
            setIsSending(true);
            try {
                //await signUp();
            }
            catch (error) {
                globalNotification.setNotifications(
                    [
                        {
                            message: error.message,
                            level: "danger",
                            key: generateGUID()
                        },
                        ...globalNotification.notifications
                    ]
                );
            }
            finally {
                setIsSending(false);
            }
        }
    }
    return (
        <div
            className={styles["authentication-box"] + " " + "text-center"}
        >
            <div
                className={styles["sign-up"]}
            >
                <Modal
                    openButtonTitle="Sign Up"
                    closeButtonTitle="Close"
                    openButtonClass={"width-half primary-btn" + " " + styles["sign-up-btn"]}
                    closeButtonClass="width-full secondary-btn margin-top-05rem margin-bottom-05rem"
                    dialogType="adaptive-modal"
                    dialogClass=""
                    onOpenButtonClick={null}
                    onCloseButtonClick={null}
                >
                    <h2
                        className="margin-top-05rem"
                    >
                        Sign Up
                    </h2>
                    <Form
                        formType="flex-column-form"
                        method="POST"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            await onSignUpSubmit(
                                new FormData(event.target),
                                isSending,
                                setIsSending,
                                setError,
                                globalNotification
                            );
                        }}
                    >
                        {
                            userConfigs.map((config) => {
                                return (
                                    <Input
                                        key={config.name}
                                        config={config}
                                    />
                                );
                            })
                        }
                        <Button
                            title="Sign Up"
                            className="width-full primary-btn margin-top-2rem"
                            type="submit"
                            onClick={null}
                            isDisabled={isSending}
                        />
                    </Form>
                </Modal>
            </div>
            <div
                className={styles["log-in"]}
            >
                <Modal
                    openButtonTitle="Log In"
                    closeButtonTitle="Close"
                    openButtonClass={"width-half primary-btn" + " " + styles["log-in-btn"]}
                    closeButtonClass="width-full primary-btn margin-top-05rem margin-bottom-05rem"
                    dialogType="adaptive-modal"
                    dialogClass=""
                    onOpenButtonClick={null}
                    onCloseButtonClick={null}
                >
                    <h2
                        className="margin-top-05rem"
                    >
                        Log In
                    </h2>
                    <Form
                        formType="flex-column-form"
                        method="POST"
                        onSubmit={null}
                    >
                        {
                            userConfigs.map((config) => {
                                if (config.name !== "passwordConfirmation") {
                                    return (
                                        <Input
                                            key={config.name}
                                            config={config}
                                        />
                                    );
                                }
                            })
                        }
                        <Button
                            title="Log In"
                            className="width-full primary-btn margin-top-2rem"
                            type="submit"
                            onClick={null}
                        />
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
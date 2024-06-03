"use client";

import { Input, Form, Modal, Button } from "@/app/components/Index.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import styles from "./authentication.module.css";
import userConfigs from "@/configurations/user-configuration.json";
import { useState, useContext } from "react";
import onAuthenticationSubmit from "./event-handlers/onAuthenticationSubmit.js";

export default function Authentication() {
    const globalNotification = useContext(NotificationBoxContext);
    const [isSending, setIsSending] = useState(false);
    const [signUpError, setSignUpError] = useState(null);
    const [logInError, setLogInError] = useState(null);
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
                    {
                        signUpError && 
                        <p
                            className="color-danger margin-top-05rem"
                        >
                            {signUpError}
                        </p>
                    }
                    <Form
                        formType="flex-column-form"
                        method="POST"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.target);
                            const credentials = {
                                email: formData.get("email"),
                                password: formData.get("password"),
                                passwordConfirmation: formData.get("passswordConfirmation")
                            };
                            await onAuthenticationSubmit(
                                credentials,
                                isSending,
                                setIsSending,
                                setSignUpError,
                                globalNotification,
                                "sign-up"
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
                    {
                        logInError && 
                        <p
                            className="color-danger margin-top-05rem"
                        >
                            {logInError}
                        </p>
                    }
                    <Form
                        formType="flex-column-form"
                        method="POST"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.target);
                            const credentials = {
                                email: formData.get("email"),
                                password: formData.get("password")
                            };
                            await onAuthenticationSubmit(
                                credentials,
                                isSending,
                                setIsSending,
                                setLogInError,
                                globalNotification,
                                "log-in"
                            );
                        }}
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
"use client";

import { useState, useContext } from "react";
import { Input, Form, Modal, Button } from "@/app/components/Index.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import userConfigs from "@/configurations/user-configuration.json";
import onAuthenticationSubmit from "./event-handlers/onAuthenticationSubmit.js";
import styles from "./authentication.module.css";

export default function Authentication() {
    const globalNotification = useContext(NotificationBoxContext);
    const [isSending, setIsSending] = useState(false);
    const [signUpError, setSignUpError] = useState(null);
    const [logInError, setLogInError] = useState(null);
    const [signUpValidationErrors, setSignUpValidationErrors] = useState(new Set());
    const [logInValidationErrors, setLogInValidationErrors] = useState(new Set());
    return (
        <div
            className={`${styles["authentication-box"]} text-center`}
        >
            <div
                className={styles["sign-up"]}
            >
                <Modal
                    openButtonTitle="Sign Up"
                    closeButtonTitle="Close"
                    openButtonClass="width-half primary-btn"
                    closeButtonClass="width-full secondary-btn margin-top-05rem margin-bottom-05rem"
                    dialogType="adaptive-modal"
                    containerClass={`${styles["modal-wrapper"]}`}
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
                        method="POST"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.target);
                            const credentials = {
                                email: formData.get("email"),
                                password: formData.get("password"),
                                passwordConfirmation: formData.get("passwordConfirmation")
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
                                        validationErrorsState={
                                            {
                                                validationErrors: signUpValidationErrors,
                                                setValidationErrors: setSignUpValidationErrors
                                            }
                                        }
                                    />
                                );
                            })
                        }
                        <Button
                            title="Sign Up"
                            className={`${(isSending || signUpValidationErrors.size > 0) ? "disabled-btn" : "primary-btn"} width-full margin-top-2rem`}
                            type="submit"
                            isDisabled={isSending || signUpValidationErrors.size > 0}
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
                    openButtonClass="width-half primary-btn"
                    closeButtonClass="width-full primary-btn margin-top-05rem margin-bottom-05rem"
                    dialogType="adaptive-modal"
                    containerClass={`${styles["modal-wrapper"]}`}
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
                                if(config.name !== "passwordConfirmation") {
                                    return (
                                        <Input
                                            key={config.name}
                                            config={config}
                                            validationErrorsState={{
                                                validationErrors: logInValidationErrors,
                                                setValidationErrors: setLogInValidationErrors
                                            }}
                                        />
                                    );
                                }
                            })
                        }
                        <Button
                            title="Log In"
                            className={`${(isSending || logInValidationErrors.size > 0) ? "disabled-btn" : "primary-btn"} width-full margin-top-2rem`}
                            type="submit"
                            isDisabled={isSending || logInValidationErrors.size > 0}
                        />
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
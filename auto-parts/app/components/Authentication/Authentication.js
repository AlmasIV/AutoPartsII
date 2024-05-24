"use client";

import { Input, Form, Modal } from "@/app/components/Index.js";
import styles from "@/app/components/Authentication/authentication.module.css";
import userConfigs from "@/configurations/user-configuration.json";

export default function Authentication() {
    return (
        <div
            className={styles["authentication-box"] + " " + "text-center"}
        >
            <div
                className={styles["log-in"]}
            >
                <Modal
                    openButtonTitle="Sign Up"
                    closeButtonTitle="Close"
                    openButtonClass={"width-half primary-btn" + " " + styles["log-in-btn"]}
                    closeButtonClass="width-full primary-btn margin-top-2rem margin-bottom-05rem"
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
                        onSubmit={() => console.log("SUBMITTIN")}
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
                    </Form>
                </Modal>
            </div>
            <div
                className={styles["sign-up"]}
            >
                <Modal
                    openButtonTitle="Log In"
                    closeButtonTitle="Close"
                    openButtonClass={"width-half primary-btn" + " " + styles["log-in-btn"]}
                    closeButtonClass="width-full primary-btn margin-top-2rem margin-bottom-05rem"
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
                        onSubmit={() => console.log("SUBMITTIN")}
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
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { ErrorBox, Form, Input, Loading, Button } from "@/app/components/Index.js";
import styles from "./account-settings.module.css";

export default function AccountSettings() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState(new Set());
    useEffect(() => {
        const fetchCurrentUser = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await fetch("/api/authenticated/user/info");
                if(result.redirected) {
                    window.location.href = result.url;
                    return;
                }
                if(!result.ok) {
                    throw new Error();
                }
                const response = await result.json();
                setUser(response.data);
            }
            catch(error) {
                setError(new Error("Something went wrong when loading user information."));
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);
    return (
        <section
            className={styles["account-settings"]}
        >
            <h2>Account Settings</h2>
            {
                isLoading ? <Loading /> : error ?
                    <ErrorBox
                        error={error}
                        errorBoxClassName="margin-top-2rem"
                    /> : (
                        <Form
                            formType="flex-column-form"
                            method="POST"
                            onSubmit={null}
                        >
                            <Input
                                config={{
                                    labelName: "Username",
                                    name: "username",
                                    type: "text",
                                    required: true,
                                    minLength: 3
                                }}
                                validationErrorsState={{ validationErrors, setValidationErrors }}
                                defaultValue={user.userName}
                            />
                            <Input
                                config={{
                                    labelName: "Email",
                                    name: "email",
                                    type: "email",
                                    required: true
                                }}
                                validationErrorsState={{ validationErrors, setValidationErrors }}
                                defaultValue={user.email}
                            />
                            <Button
                                title="Save"
                                className="primary-btn margin-top-2rem width-full"
                            />
                        </Form>
                    )
            }
        </section>
    );
}
"use client";

import { useEffect, useState } from "react";
import { ErrorBox, Form, Input, Loading, Button } from "@/app/components/Index.js";
import redirectIfCan from "@/global-utils/response-helpers/redirectIfCan.js";

/*
    This is the least important component. That's why the work is stopped here.
*/

export default function AccountSettings() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState(new Set());
    useEffect(() => {
        const abortController = new AbortController();
        const fetchCurrentUser = async () => {
            setError(null);
            try {
                const response = await fetch("/api/authenticated/users/info", {
                    signal: abortController.signal
                });
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.data || `${response.status} ${response.statusText}`));
                    return;
                }
                setUser(bodyData.data);
            }
            catch(error) {
                if(error.name !== "AbortError") {
                    setError(new Error("Something went wrong."));
                }
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCurrentUser();

        return () => abortController.abort();
    }, []);
    return (
        <section>
            <h2>Account Settings</h2>
            {
                isLoading ?
                    <Loading
                        size="medium"
                    /> : error ?
                        <ErrorBox
                            error={error}
                            errorBoxClassName="margin-top-2rem"
                        /> : (
                            <Form
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
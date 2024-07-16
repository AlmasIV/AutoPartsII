"use client";

import { useEffect, useState } from "react";
import { ErrorBox, Form, Input, Loading, Button } from "@/app/components/Index.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan.js";

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
                const response = await fetch("/api/authenticated/users/info");
                redirectIfCan(response);
                const bodyData = await response.json();
                if(!response.ok) {
                    setError(new Error(bodyData.message || `${response.status} ${response.statusText}`));
                }
                setUser(bodyData.data);
            }
            catch(error) {
                setError(new Error("Something went wrong."));
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);
    return (
        <section>
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
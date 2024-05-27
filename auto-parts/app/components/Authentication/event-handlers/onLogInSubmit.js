"use client";

import generateGUID from "@/tools/GUID/GUID.js";

export default async function onLogInSubmit(
    formData,
    isSending,
    setIsSending,
    setError,
    globalNotification
){
    if(!isSending){
        try {
            setIsSending(true);
            const response = await fetch("/api/log-in", {
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.get("email"),
                    password: formData.get("password")
                })
            });
            const responseObj = await response.json();
            if(!response.ok){
                setError(responseObj.message);
                globalNotification.setNotifications(
                    [
                        {
                            message: responseObj.message,
                            level: "danger",
                            key: generateGUID()
                        },
                        ...globalNotification.notifications
                    ]
                );
            }
            else{
                globalNotification.setNotifications(
                    [
                        {
                            message: responseObj.message,
                            level: "success",
                            key: generateGUID()
                        },
                        ...globalNotification.notifications
                    ]
                );
                window.location.href = response.headers.get("Location");
            }
        }
        catch (error){
            setError("Something went wrong.");
            globalNotification.setNotifications(
                [
                    {
                        message: "Something went wrong.",
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
"use client";

import generateGUID from "@/tools/GUID/GUID.js";

/*
    1) Do I need ths isSending?
*/

export default async function onAuthenticationSubmit(
    bodyObject,
    isSending,
    setIsSending,
    setError,
    globalNotification,
    url
) {
    if(!isSending) {
        setIsSending(true);
        setError(null);
        try {
            const response = await fetch(`/api/${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyObject)
            });
            const responseObj = await response.json();
            if(!response.ok) {
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
            else {
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
        catch(error) {
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
            setTimeout(() => setError(null), 7000);
        }
    }
}
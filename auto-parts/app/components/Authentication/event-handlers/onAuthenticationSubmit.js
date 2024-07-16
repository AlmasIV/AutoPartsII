"use client";

import generateGUID from "@/utils/GUID/GUID.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan.js";

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
            redirectIfCan(response);
            if(!response.ok) {
                const responseObj = await response.json();
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
                            message: "Successfully authenticated.",
                            level: "success",
                            key: generateGUID()
                        },
                        ...globalNotification.notifications
                    ]
                );
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
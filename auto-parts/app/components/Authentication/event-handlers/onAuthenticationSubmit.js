"use client";

import generateGUID from "@/global-utils/GUID/generateGUID.js";
import redirectIfCan from "@/global-utils/responseHelpers/redirectIfCan.js";

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
                setError(responseObj.data);
                globalNotification.setNotifications(
                    [
                        {
                            message: responseObj.data,
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
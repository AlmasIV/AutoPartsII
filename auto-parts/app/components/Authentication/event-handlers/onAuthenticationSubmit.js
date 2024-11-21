"use client";

import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";
import notify from "@/global-utils/notifications/notify.js";

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
                notify(globalNotification, responseObj.data, "danger");
            }
            else {
                notify(globalNotification, "Successfully authenticated.", "success");
            }
        }
        catch(error) {
            setError("Something went wrong.");
            notify(globalNotification, "Something went wrong.", "danger");
        }
        finally {
            setIsSending(false);
            setTimeout(() => setError(null), 7000);
        }
    }
}
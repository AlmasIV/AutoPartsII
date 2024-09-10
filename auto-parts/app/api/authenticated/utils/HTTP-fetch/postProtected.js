"use server";

import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function postProtected(url, request, isReturn = false, isFormData = false) {
    try {
        const token = request.cookies.get("jwt");
        let response = null;
        if(isFormData) {
            const formData = await request.formData();
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.value}`
                },
                body: formData
            });
        }
        else {
            const bodyData = await request.json();
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.value}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
        }
        if(!response.ok) {
            return getResponse("Couldn't post the data.", 500, "Internal Server Error");
        }
        else {
            const result = isReturn ? { data: await response.json() } : { data: "Success" };
            return getResponse(result.data, 200, "OK");
        }
    }
    catch(error) {
        return getResponse("Something went wrong.", 500, "Internal Server Error");
    }
}
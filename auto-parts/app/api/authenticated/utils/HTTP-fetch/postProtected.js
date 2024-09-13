import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function postProtected(url, request, isFormData = false, isReturnResult = false) {
    try {
        const token = request.cookies.get("jwt");
        const body = isFormData ? (await request.formData()) : (await request.json());
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.value}`
            },
            body: isFormData ? body : JSON.stringify(body)
        });
        if(!response.ok) {
            return getResponse("Couldn't post the data.", 500, "Internal Server Error");
        }
        else {
            return getResponse(isReturnResult ? (await response.json()) : "Successfully posted data.", 200, "OK");
        }
    }
    catch(error) {
        return getResponse("Something went wrong.", 500, "Internal Server Error");
    }
}
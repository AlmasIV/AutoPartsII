import getResponse from "@/global-utils/response-initializer/getResponse.js";

export default async function getProtected(url, request) {
    try {
        const token = request.cookies.get("jwt");
        const result = await fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Authorization": `Bearer ${token.value}`
            }
        });
        if(!result.ok) {
            return getResponse("Couldn't get the data.", 500, "Internal Server Error");
        }
        else {
            const response = await result.json();
            return getResponse(response, 200, "OK");
        }
    }
    catch(error) {
        return getResponse("Something went wrong.", 500, "Internal Server Error");
    }
}
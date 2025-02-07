import getResponse from "@/global-utils/response-initializer/getResponse.js";
import makeFetchWithBody from "@/global-utils/HTTP-fetch/makeFetchWithBody.js";

export default async function postProtected(url, request, isFormData = false, isReturnResult = false) {
    try {
        const response = makeFetchWithBody(url, request, "POST", isFormData);
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
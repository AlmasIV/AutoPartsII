import getResponse from "@/global-utils/response-initializer/getResponse.js";
import makeFetchWithBody from "@/global-utils/HTTP-fetch/makeFetchWithBody.js";

export default async function putProtected(url, request, isFormData = false, isReturnResult = false) {
	try {
		const response = makeFetchWithBody(url, request, "PUT", isFormData);
		if(!response.ok) {
			return getResponse("Couldn't put the data.", 500, "Internal Server Error");
		}
		else {
			return getResponse(isReturnResult ? (await response.json()) : "Successfully put data.", 200, "OK");
		}
	}
	catch {
		return getResponse("Something went wrong.", 500, "Internal Server Error");
	}
}
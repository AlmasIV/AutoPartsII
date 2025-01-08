import getResponse from "@/global-utils/response-initializer/getResponse.js";

export default async function deleteProtected(url, request) {
	try {
		const token = request.cookies.get("jwt");
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${token.value}`
			}
		});
		if(!response.ok) {
			return getResponse("Couldn't delete the resource.", 500, "Internal Server Error");
		}
		else {
			return getResponse("Successfully deleted the resource.", 200, "OK");
		}
	}
	catch(error) {
		return getResponse("Something went wrong.", 500, "Internal Server Error");
	}
}
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export default async function makeFetchWithBody(url, request, method, isFormData = false) {
	try {
		const token = request.cookies.get("jwt");
		const body = isFormData ? (await request.formData()) : (await request.json());
		const response = await fetch(url, {
			method: method,
			headers: {
				"Authorization": `Bearer ${token.value}`,
				...(isFormData ? {} : { "Content-Type": "application/json" })
			},
			body: isFormData ? body : JSON.stringify(body)
		});
		return response;
	}
	catch {
		return getResponse("Something went wrong.", 500, "Internal Server Error");
	}
}
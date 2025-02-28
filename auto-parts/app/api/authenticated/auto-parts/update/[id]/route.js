import putProtected from "@/global-utils/HTTP-fetch/putProtected.js";
import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function PUT(request, { params }) {
	if(isValidGuid(params.id)) {
		const result = await putProtected(`${process.env.API_URL}/auto-parts/update/${params.id}`, request, true, true);
		return result;
	}
	return getResponse("Provide a valid identifier.", 400, "Bad Request");
}
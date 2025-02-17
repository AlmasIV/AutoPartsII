import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import deleteProtected from "@/global-utils/HTTP-fetch/deleteProtected.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function DELETE(request, { params }) {
	if(isValidGuid(params.id)) {
		return await deleteProtected(`${process.env.API_URL}/auto-parts/images/delete/${params.id}`, request);
	}
	else {
		return getResponse("Provide a valid image id.", 400, "Bad Request");
	}
}
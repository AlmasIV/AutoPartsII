import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import deleteProtected from "@/global-utils/HTTP-fetch/deleteProtected.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function DELETE(request, { params }) {
	const { id } = await params;
	if(isValidGuid(id)) {
		return await deleteProtected(`${process.env.API_URL}/auto-parts/images/delete/${id}`, request);
	}
	else {
		return getResponse("Provide a valid image id.", 400, "Bad Request");
	}
}
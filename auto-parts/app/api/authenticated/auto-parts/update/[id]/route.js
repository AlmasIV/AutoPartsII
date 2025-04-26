import putProtected from "@/global-utils/HTTP-fetch/putProtected.js";
import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";
import { revalidateTag } from "next/cache";

export async function PUT(request, { params }) {
	const { id } = await params;
	if(isValidGuid(id)) {
		const result = await putProtected(`${process.env.API_URL}/auto-parts/update/${id}`, request, true, true);
		revalidateTag("auto-parts");
		revalidateTag(`auto-part-image-${id}`);
		return result;
	}
	return getResponse("Provide a valid identifier.", 400, "Bad Request");
}
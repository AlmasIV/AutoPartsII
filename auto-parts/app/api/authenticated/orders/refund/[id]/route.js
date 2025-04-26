import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";
import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import { revalidateTag } from "next/cache";

export async function POST(request, { params }) {
	const { id } = await params;
	if(isValidGuid(id)) {
		const result = await postProtected(`${process.env.API_URL}/orders/refund`, request);
		revalidateTag("orders");
		revalidateTag("orders-count");
		revalidateTag(`orders-${id}`);
		return result;
	}
	else {
		return getResponse("Provide a valid identifier.", 400, "Bad Request");
	}
}
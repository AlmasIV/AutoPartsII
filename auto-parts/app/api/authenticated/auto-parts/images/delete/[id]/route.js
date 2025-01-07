import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function POST(request, { params }) {
	if(canBeCastedToPositiveInteger(params.id)) {
		return await postProtected(`${process.env.API_URL}/auto-parts/images/delete/${params.id}`, request);
	}
	else {
		return getResponse("Provide a valid image id.", 400, "Bad Request");
	}
}
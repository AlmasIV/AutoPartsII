import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function GET(request, { params }) {
	if(canBeCastedToPositiveInteger(params.id)) {
		return await getProtected();
	}
	else {
		return getResponse("Provide a valid identifier.", 400, "Bad Request");
	}
}
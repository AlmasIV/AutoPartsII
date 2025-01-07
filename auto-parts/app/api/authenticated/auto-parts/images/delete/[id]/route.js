import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";

export async function POST(request, { params }) {
	if(canBeCastedToPositiveInteger(params.id)) {
		return await getProtected(`${process.env.API_URL}/orders/${params.id}`, request);
	}
}
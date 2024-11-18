import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function GET(request, { params }) {
    if(canBeCastedToPositiveInteger(params.id)) {
        return await getProtected(`${process.env.API_URL}/orders/${params.id}`, request);
    }
    else {
        return getResponse("Provide a positive integer ID.", 400, "Bad Request");
    }
}
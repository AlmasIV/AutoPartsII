import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import isPositiveInteger from "@/global-utils/validators/isPositiveInteger.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function GET(request, { params }) {
    if(isPositiveInteger(params.id)) {
        return await getProtected(`${process.env.API_URL}/orders/${params.id}`, request);
    }
    else {
        return getResponse("Provide a positive integer ID.", 400, "Bad Request");
    }
}
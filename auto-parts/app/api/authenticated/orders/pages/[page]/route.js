import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";

export async function GET(request, { params }) {
    const { page } = await params;
    if(canBeCastedToPositiveInteger(page)) {
        return await getProtected(`${process.env.API_URL}/orders/pages/${page}`, request);
    }
    else {
        return getResponse("Provide a valid page number.", 400, "Bad Request");
    }
}
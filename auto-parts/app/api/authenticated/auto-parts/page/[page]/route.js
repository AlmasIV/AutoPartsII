import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function GET(request, { params }) {
    if(canBeCastedToPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/auto-parts/page/${params.page}`, request);
    }
    else {
        return getResponse("Provide a valid page number.", 400, "Bad Request");
    }
}
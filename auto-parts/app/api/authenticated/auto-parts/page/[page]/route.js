import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import isPositiveInteger from "@/global-utils/validators/isPositiveInteger.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";

/*
    1) Added lower bound for checking the "page". What about the upper bound.
*/

export async function GET(request, { params }) {
    if(isPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/auto-parts/page/${params.page}`, request);
    }
    else {
        return getResponse("Provide a valid page number.", 400, "Bad Request");
    }
}
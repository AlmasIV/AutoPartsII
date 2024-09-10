import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger.js";

export async function GET(request, { params }) {
    if(isPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/orders/pages/${params.page}`, request);
    }
    else {
        return getResponse("Provide a valid page number.", 400, "Bad Request");
    }
}
import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";
import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";

export async function GET(request, { params }) {
    if(canBeCastedToPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/orders/pages/${params.page}`, request);
    }
    else {
        return getResponse("Provide a valid page number.", 400, "Bad Request");
    }
}
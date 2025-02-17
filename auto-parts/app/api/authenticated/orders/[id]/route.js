import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";
import isValidGuid from "@/global-utils/validators/isValidGuid.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function GET(request, { params }) {
    if(isValidGuid(params.id)) {
        return await getProtected(`${process.env.API_URL}/orders/${params.id}`, request);
    }
    else {
        return getResponse("Provide a valid identifier.", 400, "Bad Request");
    }
}
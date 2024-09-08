import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

/*
    1) Added lower bound for checking the "page". What about the upper bound.
*/

export async function GET(request, { params }) {
    if(isPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/auto-parts/page/${params.page}`, request);
    }
    else {
        return getBadResponseMessage("Provide a valid page number.");
    }
}
import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import validateId from "@/app/api/authenticated/utils/validateId/validateId.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

/*
    1) Added lower bound for checking the "page". What about the upper bound.
*/

export async function GET(request, { params }) {
    const page = Number(params.page);
    if(validateId(page)) {
        return await getProtected(`${process.env.API_URL}/auto-parts/page/${page}`, request);
    }
    else {
        return getBadResponseMessage("Provide a valid page number.");
    }
}
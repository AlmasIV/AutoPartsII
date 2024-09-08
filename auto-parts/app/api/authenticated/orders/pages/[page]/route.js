import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger.js";

export async function GET(request, { params }) {
    if(isPositiveInteger(params.page)) {
        return await getProtected(`${process.env.API_URL}/orders/pages/${params.page}`, request);
    }
    else {
        return getBadResponseMessage("Provide a valid page number.");
    }
}
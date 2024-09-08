import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import isPositiveInteger from "@/app/api/authenticated/utils/isPositiveInteger/isPositiveInteger.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

export async function GET(request, { params }) {
    if(isPositiveInteger(params.id)) {
        return await getProtected(`${process.env.API_URL}/orders/${params.id}`, request);
    }
    else {
        return getBadResponseMessage("Provide a positive integer ID.");
    }
}
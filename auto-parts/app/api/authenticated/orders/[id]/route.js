import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import validateId from "@/app/api/authenticated/utils/validateId/validateId.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

export async function GET(request, { params }) {
    const id = Number(params.id);
    if(validateId(id)) {
        return await getProtected(`${process.env.API_URL}/orders/${id}`, request);
    }
    else {
        return getBadResponseMessage("Provide a positive integer ID.");
    }
}
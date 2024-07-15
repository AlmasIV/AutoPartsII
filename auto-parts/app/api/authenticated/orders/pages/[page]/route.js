"use server";

import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";
import validateId from "@/app/api/authenticated/utils/validateId/validateId.js";

export async function GET(request, { params }) {
    const page = Number(params.page);
    if(validateId(page)) {
        return await getProtected(`https://localhost:7019/orders/pages/${page}`, request);
    }
    else {
        return getBadResponseMessage("Provide a valid page number.");
    }
}
import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import validateId from "@/app/api/authenticated/utils/validateId/validateId.js";
import { NextResponse } from "next/server.js";

/*
    1) Added lower bound for checking the "page". What about the upper bound.
*/

export async function GET(request, { params }) {
    const page = Number(params.page);
    if(validateId(page)) {
        return await getProtected(`https://localhost:7019/auto-parts/page/${page}`, request);
    }
    else {
        return NextResponse.json({
            message: "Provide a valid page number."
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }
}
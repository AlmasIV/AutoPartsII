import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";
import validateId from "@/app/api/authenticated/utils/validateId/validateId.js";
import { NextResponse } from "next/server.js";

export async function GET(request, { params }) {
    const id = Number(params.id);
    if(validateId(id)) {
        return await getProtected(`https://localhost:7019/orders/${id}`, request);
    }
    else {
        return NextResponse.json({
            message: "Provide positive integer ID."
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }
}
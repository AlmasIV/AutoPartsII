"use server";

import getProtected from "@/tools/Credentials/getProtected.js";
import { NextResponse } from "next/server.js";

export async function GET(request, { params }) {
    const page = Number(params.page);
    if(Number.isInteger(page) && page > 0) {
        return await getProtected(`https://localhost:7019/orders/pages/${page}`, request);
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
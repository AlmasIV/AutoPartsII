"use server";

import getProtected from "@/tools/Credentials/getProtected.js";
import { NextResponse } from "next/server.js";

export async function GET(request, { params }){
    const id = Number(params.id);
    if(Number.isInteger(id) && id > 0){
        return await getProtected(`https://localhost:7019/auto-parts/orders/${id}`, request);
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
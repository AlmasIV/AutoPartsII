"use server";

import { NextResponse } from "next/server.js";

export default async function setJwtCookie(cookieHeader){
    if(cookieHeader){
        const response = NextResponse.json({
            message: "Successfully registered."
        }, {
            status: 201,
            statusText: "Created"
        });
        response.headers.set("Set-Cookie", cookieHeader);
        response.headers.set("Location", `${process.env.BASE_URL}/home`);
        return response;
    }
    else {
        return NextResponse.json({
            message: "Authentication failed."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}
"use server";

import isEmail from "validator/lib/isEmail.js";
import { NextResponse } from "next/server.js";

export async function POST(request) {
    const credentials = await request.json();
    const email = credentials.email ?? "";
    const password = credentials.password ?? "";

    if (!isEmail(email)) {
        return NextResponse.json({
            message: "Enter valid email address."
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }
    if (password.length < 8) {
        return NextResponse.json({
            message: "Password's minimal length must be 8 characters."
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    let result = null;
    try {
        result = await fetch("https://localhost:7019/user/log-in", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
    }
    catch (error) {
        return NextResponse.json({
            message: "Connection with the database can't be established."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
    if (!result.ok) {
        const problemDetails = await result.json();
        return NextResponse.json({
            message: problemDetails.title
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }
    else {
        const cookieHeader = result.headers.get("Set-Cookie");
        if(cookieHeader){
            const response = NextResponse.json({
                message: "Successfully logged-in."
            }, {
                status: 200,
                statusText: "OK"
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
}
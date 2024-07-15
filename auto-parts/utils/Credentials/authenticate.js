"use server";

import { NextResponse } from "next/server.js";

export default async function authenticate(user, url, isLogIn = false) {
    let result = null;
    try {
        result = await fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
    }
    catch(error) {
        return NextResponse.json({
            message: "Connection with the database can't be established."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
    if(!result.ok) {
        let problem = await result.json();
        return NextResponse.json({
            message: isLogIn ? problem.title : problem["errors"].map((error) => {
                return error.description;
            }).join(", ")
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }
    else {
        /*
            1) Do I need to check the cookieHeader's existence?
            2) Maybe extract the logic into another function?
        */
        const cookieHeader = result.headers.get("Set-Cookie");
        if(cookieHeader) {
            const response = NextResponse.redirect(`${process.env.BASE_URL}/home`, 303);
            response.headers.set("Set-Cookie", cookieHeader);
            return response;
        }
        return NextResponse.json({
            message: "Authentication failed."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}
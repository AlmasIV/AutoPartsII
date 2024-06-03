"use server";

import { NextResponse } from "next/server.js";

export default async function authenticate(user, url) {
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
    catch (error) {
        return NextResponse.json({
            message: "Connection with the database can't be established."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
    if (!result.ok) {
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
        const cookieHeader = result.headers.get("Set-Cookie");
        if (cookieHeader) {
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
}
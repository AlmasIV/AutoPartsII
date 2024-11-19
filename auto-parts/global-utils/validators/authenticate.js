import { NextResponse } from "next/server.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export default async function authenticate(user, url, isLogIn = false) {
    try {
        const result = await fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        if(!result.ok) {
            const problem = await result.json();
            return getResponse(isLogIn ? problem.title : problem["errors"].map((error) => error.description).join(", "), 400, "Bad Request");
        }
        /*
            1) Do I need to check the cookieHeader's existence?
            2) Maybe extract the logic into another function?
        */
        const cookieHeader = result.headers.get("Set-Cookie");
        if(cookieHeader) {
            const response = NextResponse.redirect(`${process.env.BASE_URL}/main/home`, 303);
            response.headers.set("Set-Cookie", cookieHeader);
            return response;
        }
        return getResponse("Authentication failed.", 500, "Internal Server Error");
    }
    catch(error) {
        return getResponse("Connection with the database can't be established.", 500, "Internal Server Error");
    }
}
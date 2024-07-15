"use server";

import { NextResponse } from "next/server.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

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
        return getBadResponseMessage("Connection with the database can't be established.", 500, "Internal Server Error");
    }
    if(!result.ok) {
        let problem = await result.json();
        return getBadResponseMessage(isLogIn ? problem.title : problem["errors"].map((error) => error.description).join(", "));
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
        return getBadResponseMessage("Authentication failed.", 500, "Internal Server Error");
    }
}
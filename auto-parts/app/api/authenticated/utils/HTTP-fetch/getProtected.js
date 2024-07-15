import { NextResponse } from "next/server.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

export default async function getProtected(url, request, cacheTag = null) {
    try {
        const token = request.cookies.get("jwt");
        const options = cacheTag ? {
            next: {
                tags: [cacheTag]
            }
        } : {
            cache: "no-cache"
        };
        const result = await fetch(url, {
            ...options,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token.value}`
            }
        });
        if(!result.ok) {
            return getBadResponseMessage("Couldn't get the data.", 500, "Internal Server Error");
        }
        else {
            const response = await result.json();
            return NextResponse.json({
                data: response
            }, {
                status: 200,
                statusText: "OK"
            });
        }
    }
    catch(error) {
        return getBadResponseMessage("Something went wrong.", 500, "Internal Server Error");
    }
}
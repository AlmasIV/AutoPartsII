"use server";

import { NextResponse } from "next/server.js";

export default async function getProtected(url, request, cacheTag=null){
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
                "authorize": token.value
            }
        });
        const response = await result.json();
        if(!result.ok){
            return NextResponse.json({
                message: "Couldn't get the data."
            }, {
                status: 500,
                statusText: "Internal Server Error"
            });
        }
        else{
            return NextResponse.json({
                data: response
            }, {
                status: 200,
                statusText: "OK"
            });
        }
    }
    catch(error) {
        return NextResponse.json({
            message: "Something went wrong."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}
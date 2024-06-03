"use server";

import { NextResponse } from "next/server.js";

export async function postProtected(url, request){
    try {
        const bodyData = await request.json();
        const token = request.cookies.get("jwt");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorize": token.value
            },
            body: JSON.stringify(bodyData)
        });
        if(!response.ok){
            throw new Error();
        }
        else {
            return NextResponse.json({
                message: "Success."
            }, {
                status: 200,
                statusText: "OK"
            });
        }
    }
    catch(error){
        return NextResponse.json({
            message: "Something went wrong."
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}
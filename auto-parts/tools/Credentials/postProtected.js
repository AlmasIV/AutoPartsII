"use server";

import { NextResponse } from "next/server.js";

export async function postProtected(url, request, isReturn = false, isFormData = false) {
    /*
        1) Don't forget to set the Authorize: "Bearer jwtToken". Because it is an industry standard. You are currently using the "authorize".
    */
    try {
        const token = request.cookies.get("jwt");
        let response = null;
        if(isFormData){
            const formData = await request.formData();
            console.log("FormData:");
            console.log(formData);
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "authorize": token.value,
                    "Content-Type": "multipart/form-data"
                },
                body: formData
            });
        }
        else {
            const bodyData = await request.json();
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "authorize": token.value,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
        }
        if(!response.ok) {
            return NextResponse.json({
                message: "Couldn't post the data."
            }, {
                status: 500,
                statusText: "Internal Server Error"
            });
        }
        else {
            const result = isReturn ? { data: await response.json() } : {};
            return NextResponse.json({
                message: "Success.",
                ...result
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
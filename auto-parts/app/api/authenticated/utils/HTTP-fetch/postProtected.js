"use server";

import { NextResponse } from "next/server.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

export async function postProtected(url, request, isReturn = false, isFormData = false) {
    try {
        const token = request.cookies.get("jwt");
        let response = null;
        if(isFormData) {
            const formData = await request.formData();
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.value}`
                },
                body: formData
            });
        }
        else {
            const bodyData = await request.json();
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.value}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
        }
        if(!response.ok) {
            return getBadResponseMessage("Couldn't post the data.", 500, "Internal Server Error");
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
        return getBadResponseMessage("Something went wrong.", 500, "Internal Server Error");
    }
}
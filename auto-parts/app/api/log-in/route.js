"use server";

import { NextResponse } from "next/server.js";
import credentialsAssertion from "@/tools/Credentials/credentialsAssertion.js";
import authenticate from "@/tools/Credentials/authenticate.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials, true);

    if(!assertionInfo.isValid) {
        return NextResponse.json({
            message: assertionInfo.message
        }, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return await authenticate({
        email: credentials.email,
        password: credentials.password
    }, "https://localhost:7019/users/log-in", true);
}
"use server";

import { NextResponse } from "next/server.js";
import credentialsAssertion from "@/tools/Credentials/credentialsAssertion.js";
import authenticate from "@/app/api/utils/authenticate.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials);

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
        password: credentials.password,
        passwordConfirmation: credentials.passwordConfirmation
    }, "https://localhost:7019/users/sign-up");
}
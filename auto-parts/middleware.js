import { NextResponse } from "next/server.js";
import * as jose from "jose";

/*
    1) Suppose a "token" is a random string, then you get a loop, the server will be dead.
    2) Implement refresh-tokens. ANSWER: I will implement it at the client-side.
    3) Need to extract a lot of code into other functions.
*/

export async function middleware(request) {
    const token = request.cookies.get("jwt");
    if(!token && request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", process.env.BASE_URL));
    }
    else if(token) {
        try {
            await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_KEY), { issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE });
            if(request.nextUrl.pathname === "/") {
                return NextResponse.redirect(new URL("/home", process.env.BASE_URL));
            }
        }
        catch(error) {
            const response = NextResponse.redirect(new URL("/", process.env.BASE_URL));
            response.cookies.delete("jwt");
            return response;
        }
    }
}

export const config = {
    matcher: [
        "/home",
        "/history",
        "/",
        "/api/authenticated/:path*",
        "/settings"
    ]
};
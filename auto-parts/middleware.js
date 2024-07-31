import { NextResponse } from "next/server.js";
import * as jose from "jose";

/*
    1) Suppose a "token" is a random string, then you get a loop, the server will be dead.
    2) Implement refresh-tokens. ANSWER: I will implement it at the client-side. DONE!!!
    3) Need to extract a lot of code into other functions. Is that so?
    4) Validate the request.url? What are the best practices? Seems like I need to sanitize it.
*/

export async function middleware(request) {
    const token = request.cookies.get("jwt");
    if(!token && request.nextUrl.pathname !== "/") {
        const refreshToken = request.cookies.get("refreshToken");
        if(!refreshToken) {
            return redirectToLogIn();
        }
        const response = await fetch(`${process.env.API_URL}/users/refresh-token/${refreshToken}`);
        if(response.ok) {
            const cookie = response.headers.get("Set-Cookie");
            if(cookie) {
                const result = NextResponse.redirect(request.url, 307);
                result.headers.set("Set-Cookie", cookie);
                result.headers.set("Location", request.url);
                return result;
            }
        }
        const result = redirectToLogIn();
        result.cookies.delete("refreshToken");
        return result;
    }
    else if(token) {
        try {
            await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_KEY), { issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE });
            if(request.nextUrl.pathname === "/") {
                return NextResponse.redirect(new URL("/home", process.env.BASE_URL));
            }
        }
        catch(error) {
            const response = redirectToLogIn();
            response.cookies.delete("jwt");
            return response;
        }
    }

    function redirectToLogIn() {
        return NextResponse.redirect(new URL("/", process.env.BASE_URL));
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
import { NextResponse } from "next/server.js";
import * as jose from "jose";

export async function middleware(request) {
    const token = request.cookies.get("jwt");
    if (!token && request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", process.env.BASE_URL));
    }
    else if (token) {
        try {
            await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_KEY), {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            });
            if(request.nextUrl.pathname === "/"){
                return NextResponse.redirect(new URL("/home", process.env.BASE_URL));
            }
        }
        catch(error){
            const response = NextResponse.redirect(new URL("/", process.env.BASE_URL));
            response.cookies.delete("jwt");
            return response;
        }
    }
}

export const config = {
    matcher: 
        [
            "/home",
            "/history",
            "/",
            "/api/authenticated/:path*",
            "/settings"
        ]
};
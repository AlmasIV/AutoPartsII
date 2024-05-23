import { NextResponse } from "next/server.js";
import jwt from "jsonwebtoken";

export function middleware(request) {
    if (!request.nextUrl.pathname.startsWith("/authenticate")) {
        const token = request.cookies.get("jwt");
        if (!token) {
            const signUpPage = new URL("/authenticate/", process.env.BASE_URL);

            return NextResponse.redirect(signUpPage.toString());
        }
    }

}

export const config = {
    matcher: ["/", "/history"]
};
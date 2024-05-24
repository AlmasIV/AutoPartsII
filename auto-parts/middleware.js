import { NextResponse } from "next/server.js";
import jwt from "jsonwebtoken";

export function middleware(request) {
    const token = request.cookies.get("jwt");
    if (!token) {
        const signUpPage = new URL("/", process.env.BASE_URL);
        return NextResponse.redirect(signUpPage.toString());
    }
}

export const config = {
    matcher: ["/home", "/history"]
};
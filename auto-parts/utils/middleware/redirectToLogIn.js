import { NextResponse } from "next/server";

export default function redirectToLogIn() {
	return NextResponse.redirect(new URL("/", process.env.BASE_URL));
}
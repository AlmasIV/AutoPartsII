import { NextResponse } from "next/server";

export default function getLogInRedirectionResponse() {
	return NextResponse.redirect(new URL("/", process.env.BASE_URL));
}
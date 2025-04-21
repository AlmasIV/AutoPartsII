import { NextResponse } from "next/server";

export default function getLogInRedirectionResponse() {
	const response = NextResponse.redirect(new URL("/", process.env.BASE_URL));
	response.cookies.set("jwt", "", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 0
	});

	response.cookies.set("refreshToken", "", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 0
	});

	return response;
}
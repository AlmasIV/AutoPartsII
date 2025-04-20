import { NextResponse } from "next/server";
import getLogInRedirectionResponse from "@/global-utils/redirect-helpers/getLogInRedirectionResponse.js";
import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";

export default async function authenticate(request) {
	const token = request.cookies.get("jwt");
	if(!token && request.nextUrl.pathname !== "/") {
		const refreshToken = request.cookies.get("refreshToken");
		if(!refreshToken) {
			return getLogInRedirectionResponse();
		}
		const response = await fetch(`${process.env.API_URL}/users/refresh-token/${refreshToken.value}`);
		if(response.ok) {
			const cookie = response.headers.get("Set-Cookie");
			if(cookie) {
				const result = NextResponse.redirect(request.url, 307);
				result.headers.set("Set-Cookie", cookie);
				result.headers.set("Location", request.url);
				return result;
			}
		}
		const result = getLogInRedirectionResponse();
		result.cookies.delete("refreshToken");
		return result;
	}
	else if(token) {
		try {
			const response = await getProtected(process.env.API_URL + "/jwt/validate", request);
			if(response.ok) {
				if(request.nextUrl.pathname === "/") {
					return NextResponse.redirect(new URL("/main/home", process.env.BASE_URL));
				}
			}
			else {
				const response = getLogInRedirectionResponse();
				response.cookies.delete("jwt");
				response.cookies.delete("refreshToken");
				return response;
			}
		}
		catch(error) {
			const response = getLogInRedirectionResponse();
			response.cookies.delete("jwt");
			response.cookies.delete("refreshToken");
			return response;
		}
	}
}
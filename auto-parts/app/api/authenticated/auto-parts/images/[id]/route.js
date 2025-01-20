import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	if(canBeCastedToPositiveInteger(params.id)) {
		try {
			const token = request.cookies.get("jwt");
			const response = await fetch(`${process.env.API_URL}/auto-parts/${params.id}`, {
				method: "GET",
				cache: "no-cache",
				headers: {
					"Authorization": `Bearer ${token.value}`
				}
			});
			if(!response.ok) {
				return getResponse("Couldn't get the data.", 500, "Internal Server Error");
			}
			else {
				if(response.status === 204) {
					return new Response(null, {
						status: 204,
						statusText: "No Content"
					});
				}

				return new NextResponse(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: {
						"Content-Type": response.headers.get("Content-Type")
					}
				});
			}
		}
		catch(error) {
			return getResponse("Something went wrong.", 500, "Internal Server Error");
		}
	}
	else {
		return getResponse("Provide a valid identifier.", 400, "Bad Request");
	}
}
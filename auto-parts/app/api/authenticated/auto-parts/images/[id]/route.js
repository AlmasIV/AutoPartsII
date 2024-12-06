import canBeCastedToPositiveInteger from "@/global-utils/validators/canBeCastedToPositiveInteger.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	console.log("GET WAS CALLED");
	if(canBeCastedToPositiveInteger(params.id)) {
		try {
			const token = request.cookies.get("jwt");
			const result = await fetch(`${process.env.API_URL}/auto-parts/${params.id}`, {
				method: "GET",
				cache: "no-cache",
				headers: {
					"Authorization": `Bearer ${token.value}`
				}
			});
			if(!result.ok) {
				console.log("The result is not ok!");
				const errorJson = await result.json();
				console.log(errorJson);
				return getResponse("Couldn't get the data.", 500, "Internal Server Error");
			}
			else {
				if(result.status === 204) {
					console.log("You've got no images!");
					return new Response(null, {
						status: 204,
						statusText: "No Content"
					});
				}
				console.log("STREAMING!");
				return new NextResponse(result.body, {
					status: result.status,
					statusText: result.statusText,
					headers: {
						"Content-Type": "application/octet-stream"
					}
				});
			}
		}
		catch(error) {
			console.log("Catched an error:");
			console.log(error);
			return getResponse("Something went wrong.", 500, "Internal Server Error");
		}
	}
	else {
		return getResponse("Provide a valid identifier.", 400, "Bad Request");
	}
}
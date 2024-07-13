"use server";

import { NextResponse } from "next/server";

export async function extractJwtToken(request){
	const token = request.cookies.get("jwt");
	if(!token){
		
	}
}
import { NextResponse } from "next/server";

export default function getBadResponseMessage(message, status = 400, statusText = "Bad Request"){
	return NextResponse.json({
		message: message
	}, {
		status: status,
		statusText: statusText
	});
}
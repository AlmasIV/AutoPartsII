import { NextResponse } from "next/server";

export default function getResponse(data, status, statusText) {
	return NextResponse.json({
		data: data
	}, {
		status: status,
		statusText: statusText
	});
}
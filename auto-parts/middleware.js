import { authenticate } from "@/middlewares/index.js";

export async function middleware(request) {
    const response = await authenticate(request);
    if(response) {
        return response;
    }
}

export const config = {
    matcher: [
        "/home",
        "/history",
        "/",
        "/api/authenticated/:path*",
        "/settings"
    ]
};
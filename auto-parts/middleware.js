import { authenticate } from "@/middlewares/index.js";

export async function middleware(request) {
    const response = await authenticate(request);
    if(response) {
        return response;
    }
}

export const config = {
    matcher: [
        "/main/:path*",
        "/",
        "/api/authenticated/:path*",
        "/settings"
    ]
};
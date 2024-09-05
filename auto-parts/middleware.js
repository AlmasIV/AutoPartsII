import { authenticate } from "@/middlewares/index.js";

export async function middleware(request) {
    await authenticate(request);
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
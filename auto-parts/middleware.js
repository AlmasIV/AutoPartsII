import authenticate from "@/middlewares/authenticate.js";

export async function middleware(request) {
    const response = await authenticate(request);
    if(response) {
        return response;
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/).*)",
        "/api/authenticated/:path*"
    ]
};
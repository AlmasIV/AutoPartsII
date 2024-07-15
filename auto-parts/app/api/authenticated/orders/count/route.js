import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";

export async function GET(request) {
    return await getProtected("https://localhost:7019/orders/count", request);
}
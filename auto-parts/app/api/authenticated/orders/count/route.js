import getProtected from "@/app/api/authenticated/utils/HTTP-fetch/getProtected.js";

export async function GET(request) {
    return await getProtected(`${process.env.API_URL}/orders/count`, request);
}
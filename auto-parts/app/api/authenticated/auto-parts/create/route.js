import { postProtected } from "@/app/api/authenticated/utils/HTTP-fetch/postProtected.js";

export async function POST(request) {
    const result = await postProtected(`${process.env.API_URL}/auto-parts/create`, request, true, true);
    return result;
}
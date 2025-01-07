import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";

export async function POST(request) {
    const result = await postProtected(`${process.env.API_URL}/auto-parts/sell`, request, false, true);
    return result;
}
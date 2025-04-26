import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";
import { revalidateTag } from "next/cache";

export async function POST(request) {
    const result = await postProtected(`${process.env.API_URL}/auto-parts/create`, request, true, true);
    revalidateTag("auto-parts-count");
    return result;
}
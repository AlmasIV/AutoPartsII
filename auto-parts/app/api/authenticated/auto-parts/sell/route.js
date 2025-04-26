import postProtected from "@/global-utils/HTTP-fetch/postProtected.js";
import { revalidateTag } from "next/cache";

export async function POST(request) {
    const result = await postProtected(`${process.env.API_URL}/auto-parts/sell`, request, false, true);
    revalidateTag("auto-parts");
    revalidateTag("orders");
    revalidateTag("orders-count");
    return result;
}
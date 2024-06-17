"use server";

import { postProtected } from "@/tools/Credentials/postProtected.js";
import { revalidateTag } from "next/cache.js";

export async function POST(request){
    const result = await postProtected("https://localhost:7019/auto-parts/sell", request);
    if(result.ok){
        revalidateTag("all-auto-parts");
        revalidateTag("orders-count");
    }
    return result;
}
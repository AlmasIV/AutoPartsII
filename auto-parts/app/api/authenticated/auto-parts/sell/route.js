"use server";

import { postProtected } from "@/tools/Credentials/postProtected.js";
import { revalidateTag } from "next/cache.js";

export async function POST(request){
    const result = await postProtected("https://localhost:7019/auto-parts/sell", request, false);
    if(result.ok){
        revalidateTag("all-auto-parts");
        revalidateTag("all-orders");
    }
    return result;
}
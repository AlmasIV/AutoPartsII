"use server";

import { postProtected } from "@/tools/Credentials/postProtected.js";
import { revalidateTag } from "next/cache.js";

export async function POST(request){
    const result = await postProtected("https://localhost:7019/auto-parts/create", request, true);
    if(result.ok){
        revalidateTag("all-auto-parts");
        revalidateTag("auto-parts-count");
    }
    return result;
}
"use server";

import { postProtected } from "@/tools/Credentials/postProtected.js";

export async function POST(request){
    return await postProtected("https://localhost:7019/auto-parts/sell", request);
}
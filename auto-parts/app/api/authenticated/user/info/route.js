"use server";

import getProtected from "@/tools/Credentials/getProtected.js";

export async function GET(request) {
    return await getProtected("https://localhost:7019/user/info", request);
}
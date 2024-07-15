import { postProtected } from "@/tools/Credentials/postProtected.js";

export async function POST(request) {
    const result = await postProtected("https://localhost:7019/auto-parts/create", request, true, true);
    return result;
}
import getProtected from "@/global-utils/HTTP-fetch/getProtected.js";

export async function GET(request) {
    return await getProtected(`${process.env.API_URL}/auto-parts/count`, request, { cache: "force-cache", next: { tags: ["auto-parts-count"] } });
}
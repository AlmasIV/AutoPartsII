import { revalidateTag } from "next/cache.js";

export default async function Catalog(){
    const autoParts = await getAutoParts();
    return (
        <h1>{autoParts}</h1>
    );
}

async function getAutoParts(){
    const result = await fetch("https://localhost:7019/auto-parts/all", { next: { tags: ["collection"] } });

    if(!result.ok){
        throw new Error("Failed to fetch all auto parts.");
    }

    return result.json();
}
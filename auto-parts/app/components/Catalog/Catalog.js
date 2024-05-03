import { TableOfAutoParts } from "../Index.js";
import { revalidateTag } from "next/cache.js";

export default async function Catalog(){
    //revalidatePath("collection");
    revalidateTag("collection");
    const autoParts = await getAutoParts();
    return (
        <TableOfAutoParts autoPartCollection={autoParts} />
    );
}

async function getAutoParts(){
    const result = await fetch("https://localhost:7019/auto-parts/all", { next: { tags: ["collection"] }});

    if(!result.ok){
        throw new Error("Failed to fetch all auto parts.");
    }

    return result.json();
}
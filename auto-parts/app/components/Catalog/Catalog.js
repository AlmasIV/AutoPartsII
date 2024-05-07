"use client";

import { useState, useEffect } from 'react';
import { TableOfAutoParts } from "../Index.js";

export default function Catalog(
    {
        selectedAutoParts,
        setSelectedAutoParts
    }
){
    const [autoParts, setAutoParts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null); // Clear any previous errors
            try {
                const result = await fetch("https://localhost:7019/auto-parts/all");
                if (!result.ok) {
                    throw new Error("Failed to fetch all auto parts.");
                }
                const fetchedAutoParts = await result.json();
                setAutoParts(fetchedAutoParts);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures data is fetched only once on mount

    return (
        <div>
            {isLoading && <p>Loading auto parts...</p>}
            {error && <p>Error: {error}</p>}
            {autoParts.length > 0 && <TableOfAutoParts autoPartCollection={autoParts} selectedAutoParts={selectedAutoParts} setSelectedAutoParts={setSelectedAutoParts} />}
        </div>
    );
}

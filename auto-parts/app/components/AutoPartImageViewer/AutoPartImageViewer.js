"use client";

import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan";
import { Fragment, useEffect, useState } from "react";
import { Loading } from "@/app/components/Index.js";

export default function AutoPartImageViewer(
	{
		autoPartId
	}
) {
	const [imageObjects, setImageObjects] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const abortController = new AbortController();
		const fetchImages = async () => {
			setError(null);
			setIsPending(true);
			try {
				const response = await fetch(`/api/authenticated/auto-parts/images/${autoPartId}`, {
					signal: abortController.signal
				});
				redirectIfCan(response);
				if(!response.ok) {
					const resultJson = await response.json();
					setError(new Error(resultJson));
				}
				const reader = response.body.getReader();
				const decoder = new TextDecoder("utf-8");
				let imageChunks = [];
				const imageObjs = [];
				let titleBuffer = "";
				let isReadingTitle = true;
				while(true) {
					const { value, done } = await reader.read();
					if(done) {
						break;
					}
					for(let i = 0; i < value.length; i ++) {
						const byte = value[i];
						if(isReadingTitle) {
							if(byte === 10){
								const title = titleBuffer.trim();
								titleBuffer = "";
								isReadingTitle = false;
								if(imageChunks.length > 0) {
									const blob = new Blob([new Uint8Array(imageChunks)], { type: "image/jpeg" });
									imageObjs.push({ src: URL.createObjectURL(blob), altText: title });
									imageChunks = [];
								}
							}
							else {
								titleBuffer += decoder.decode(new Uint8Array([byte]), { stream: true });
							}
						}
						else {
							imageChunks.push(byte);
						}
					}
				}
				if(imageChunks.length > 0) {
					const blob = new Blob([new Uint8Array(imageChunks)], { type: "image/jpeg" });
					imageObjs.push({ src: URL.createObjectURL(blob), altText: titleBuffer.trim() });
				}
				setImageObjects(imageObjs);
			}
			catch(error) {
				if(error.name !== "AbortError") {
					setError(new Error("Something went wrong!"));
				}
			}
			finally {
				setIsPending(false);
			}
		};
		fetchImages();
		return () => abortController.abort();
	}, [autoPartId]);
	return (
		<Fragment>
			{
				error ? <p>Something bad has happened</p> : isPending ? <Loading /> : imageObjects.map((obj) => <img key={obj.altText} src={obj.src} alt={obj.altText} />)
			}
		</Fragment>
	);
}
import { useState, useEffect } from "react";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";

export default function useAutoPartImageStream(autoPartId) {
	if(!autoPartId) {
		throw new TypeError("The auto-part-id cannot be a falsy value.");
	}

	const [imageObjects, setImageObjects] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		const streamImages = async () => {
			setError(null);
			setIsPending(true);
			try {
				const response = await fetch(`/api/authenticated/auto-parts/images/${autoPartId}`, {
					signal: abortController.signal
				});
				redirectIfCan(response);
				if(!response.ok) {
					let errorMessage = "";
					try {
						const resultJson = await response.json();
						errorMessage = `${resultJson?.title ?? response.status}: ${resultJson?.details ?? response.statusText}.`;
					}
					catch(jsonParsingError) {
						if(jsonParsingError instanceof TypeError) {
							errorMessage = "The negative response for images stream doesn't contain error details in the form of JSON.";
						}
						else {
							errorMessage = "Something went wrong while parsing the negative response for images stream.";
						}
					}
					setError(new Error(errorMessage));
					return;
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder("utf-8");
				const imageObjs = [];
				let imageChunks = [];
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
							if(byte === 10) {
								const title = titleBuffer.trim();
								titleBuffer = "";
								isReadingTitle = false;
								if(imageChunks.length > 0) {
									const blob = new Blob([new Uint8Array(imageChunks)], { type: "image/jpeg" });
									imageObjs.push({ src: URL.createObjectURL(blob), title: title });
									imageChunks = [];
								}
							}
							else {
								// Isn't it better to just collect bytes, and then decode all of it at once?
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
					imageObjs.push({ src: URL.createObjectURL(blob), title: titleBuffer.trim() });
				}

				setImageObjects(imageObjs);
			}
			catch(streamError) {
				if(streamError.name !== "AbortError") {
					setError(new Error("Something unexpected happened while streaming data."));
				}
			}
			finally {
				setIsPending(false);
			}
		};

		streamImages();

		return () => abortController.abort();
	}, [autoPartId]);

	return { imageObjects, isPending, error };
}
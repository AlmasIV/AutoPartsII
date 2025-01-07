import { useState, useEffect } from "react";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";

export default function useFilesStream(url, type) {
	if(!url) {
		return {
			files: [],
			isPending: false
		};
	}

	const [files, setFiles] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [streamError, setStreamError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		const streamImages = async () => {
			setStreamError(null);
			setIsPending(true);
			try {
				const response = await fetch(url, {
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
					setStreamError(new Error(errorMessage));
					return;
				}
				const reader = response.body.getReader();
				const decoder = new TextDecoder("utf-8");
				const imageObjs = [];
				let imageChunks = [];
				let titleBuffer = "", title = "", imageId = "";
				let isReadingTitle = true;

				while(true) {
					const { value, done } = await reader.read();
					if(done) {
						break;
					}
					for(let i = 0; i < value.length; i++) {
						const byte = value[i];
						if(isReadingTitle) {
							if(byte === 10) {
								imageId = titleBuffer.substring(titleBuffer.lastIndexOf("-") + 1);
								title = titleBuffer.substring(0, titleBuffer.lastIndexOf("-"));
								titleBuffer = "";
								isReadingTitle = false;
								if(imageChunks.length > 0) {
									imageObjs.push({
										file: new File([new Blob([new Uint8Array(imageChunks)], { type: type })], title, {
											type: type
										}),
										id: imageId,
										isStreamed: true
									});
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
					imageObjs.push({
						file: new File([new Blob([new Uint8Array(imageChunks)], { type: type })], title, {
							type: type
						}),
						id: imageId,
						isStreamed: true
					});
				}

				setFiles(imageObjs);
			}
			catch(streamError) {
				if(streamError.name !== "AbortError") {
					setStreamError(new Error("Something unexpected happened while streaming data."));
				}
			}
			finally {
				setIsPending(false);
			}
		};

		streamImages();

		return () => abortController.abort();
	}, [url, type]);

	return { files, setFiles, isPending, streamError };
}

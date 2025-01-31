import { useState, useEffect } from "react";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";
import getIndexAfterBoundary from "@/global-utils/validators/getIndexAfterBoundary.js";

const emptyResult = {
	files: [],
	isPending: false
};

export default function useFilesStream(url, type) {
	if(!url) {
		return emptyResult;
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
				if(response.status === 204) {
					return emptyResult;
				}
				const reader = response.body.getReader();
				const streamChunks = [];
				let streamedBytesLength = 0;
				while(true) {
					const { value, done } = await reader.read();
					if(value) {
						streamChunks.push(value);
						streamedBytesLength += value.length;
					}
					if(done) {
						break;
					}
				}
				let offset = 0;
				const streamAsUint8Array = new Uint8Array(streamedBytesLength);
				streamChunks.forEach((subArray) => {
					streamAsUint8Array.set(subArray, offset);
					offset += subArray.length;
				});

				const encoder = new TextEncoder();
				const decoder = new TextDecoder("utf-8");

				const contentType = response.headers.get("Content-Type");
				const boundary = contentType.slice(contentType.lastIndexOf("boundary=") + 9);

				const headerStartingBoundaryBytes = encoder.encode(`--${boundary}\r\n`);
				const imageStartingBoundaryBytes = encoder.encode("\r\n\r\n");
				const streamEndingBoundaryBytes = encoder.encode(`\r\n--${boundary}--\r\n`);

				let headerStartIndex, imageStartIndex, imageEndIndex;

				let headerKeyValuePair;

				const imageHeaders = new Map();
				const imageObjects = [];

				offset = 0;
				while(offset + streamEndingBoundaryBytes.length < streamAsUint8Array.length) {
					headerStartIndex = getIndexAfterBoundary(offset, streamAsUint8Array, headerStartingBoundaryBytes);
					imageStartIndex = getIndexAfterBoundary(headerStartIndex, streamAsUint8Array, imageStartingBoundaryBytes);

					decoder.decode(streamAsUint8Array.slice(headerStartIndex, imageStartIndex - imageStartingBoundaryBytes.length)).split("\r\n").forEach((headerAsText) => {
						headerKeyValuePair = headerAsText.split(": ");
						imageHeaders.set(headerKeyValuePair[0], headerKeyValuePair[1]);
					});

					imageEndIndex = imageStartIndex + Number(imageHeaders.get("X-Image-Length"));

					imageObjects.push({
						file: new File([streamAsUint8Array.slice(imageStartIndex, imageEndIndex)], imageHeaders.get("X-Title"), { type: imageHeaders.get("Content-Type") }),
						id: imageHeaders.get("X-Id"),
						isStreamed: true
					});

					offset = imageEndIndex;
				}

				setFiles(imageObjects);
			}
			catch(streamError) {
				if(streamError.name !== "AbortError") {
					setStreamError(new Error("Something unexpected happened while streaming data."));
					setFiles([]);
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

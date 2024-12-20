"use client";

import { Fragment, useState } from "react";
import { Button } from "@/app/components/Index.js";
import useFilesStream from "@/global-utils/custom-hooks/useFilesStream.js";

export default function FilesInput(
	{
		title,
		name,
		accept,
		capture="environment",
		isMultiple = false,
		isRequired = false,
		isDisabled = false,
		autoPartId = 0
	}
) {
	const [files, setFiles] = useState([]);
	function handleFilesChange(filesArray) {
		const validFiles = filesArray.filter((file) => accept.includes(file.type));
		if(validFiles.length > 0) {
			setFiles([...files, ...validFiles]);
		}
	}

	const {
		files: streamedImages,
		isPending: isStreamingImagesPending,
		error: streamError
	} = useFilesStream(`/api/authenticated/auto-parts/images/${autoPartId}`);

	if(streamedImages && !streamError) {
		handleFilesChange(Array.from(streamedImages));
	}

	return (
		<Fragment>
			<p
				className="margin-top-2rem small-text margin-bottom-05rem"
			>
				Images accept only these file types:
				{
					` ${accept.map((validFileType) => {
						return `.${validFileType.split("/")[1]}`;
					}).join(", ")}.`
				}
			</p>
			<label
				className={`${isDisabled ? "disabled-btn" : "secondary-btn"} text-center width-full`}
			>
				{title}
				<input
					type="file"
					multiple={isMultiple}
					accept={accept.join(", ")}
					capture={capture}
					name={name}
					required={isRequired}
					onChange={(e) => {
						handleFilesChange(Array.from(e.target.files));
					}}
					disabled={isDisabled}
					className="display-none"
				/>
			</label>
			<div
				className="flex-container flex-wrap overflow-auto small-text"
			>
				{
					files.map((file) => {
						return (
							<div
								key={file.name + file.lastModified + file.size}
							>
								{
									file.type.startsWith("image/") ?
										<img
											src={URL.createObjectURL(file)}
											className="width-full margin-top-05rem"
											alt={file.name}
										/> :
										<p
											className="margin-top-05rem"
										>
											{file.name}
										</p>
								}
								<Button
									title="Remove"
									className="width-full secondary-btn text-center"
									type="button"
									onClick={() => {
										setFiles(files.filter((f) => f.name !== file.name && f.size !== file.size && f.lastModified !== file.lastModified));
									}}
								/>
							</div>
						);
					})
				}
			</div>
		</Fragment>
	);
}
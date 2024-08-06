"use client";

import { Fragment, useState } from "react";
import generateGUID from "@/utils/GUID/GUID";
import { Button } from "@/app/components/Index.js";

export default function FilesInput(
	{
		title,
		name,
		accept,
		capture,
		isMultiple = false,
		isRequired = false,
		isDisabled = false
	}
) {
	const [files, setFiles] = useState([]);
	function handleFilesChange(event) {
		const newFiles = [];
		const inputFiles = event.target.files;
		for(let file of inputFiles) {
			if(!files.some((f) => {
				return f.name === file.name && f.size === file.size && f.lastModified === file.lastModified;
			}) && accept.includes(file.type)) {
				newFiles.push(file);
			}
		}
		if(newFiles.length > 0) {
			setFiles(
				[
					...files,
					...newFiles
				]
			);
		}
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
				className={`${isDisabled ? "disabled-btn" : "informational-btn"} text-center width-full`}
			>
				{title}
				<input
					type="file"
					multiple={isMultiple}
					accept={accept.join(", ")}
					capture={capture}
					name={name}
					required={isRequired}
					onChange={handleFilesChange}
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
								key={generateGUID()}
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
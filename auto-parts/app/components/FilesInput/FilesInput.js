"use client";

import { Fragment, useState } from "react";
import styles from "./files-input.module.css";

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
			if(!files.some((existingFile) => {
				return existingFile.name === file.name && existingFile.size === file.size && existingFile.lastModified === file.lastModified;
			})) {
				newFiles.push(file);
			}
		}
		setFiles(
			[
				...files,
				...newFiles
			]
		);
	}
	return (
		<Fragment>
			<label
				className={`${styles["files-input"]} ${isDisabled ? "disabled-btn" : "informational-btn"} text-center width-full margin-top-2rem`}
			>
				{title}
				<input
					type="file"
					multiple={isMultiple}
					accept={accept}
					capture={capture}
					name={name}
					required={isRequired}
					onChange={handleFilesChange}
					disabled={isDisabled}
				/>
			</label>
		</Fragment>
	);
}
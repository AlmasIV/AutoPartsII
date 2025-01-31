"use client";

import { Fragment, useState, useContext } from "react";
import { Button, Modal } from "@/app/components/Index.js";
import useFilesStream from "@/global-utils/custom-hooks/useFilesStream.js";
import generateGUID from "@/global-utils/GUID/generateGUID.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import notify from "@/global-utils/notifications/notify.js";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";

export default function ImagesInput(
	{
		title,
		name,
		accept,
		capture = "environment",
		isMultiple = false,
		isRequired = false,
		isDisabled = false,
		autoPartId = 0
	}
) {
	const [files, setFiles] = useState([]);
	const globalNotification = useContext(NotificationBoxContext);
	function handleFilesChange(filesArray) {
		const validFiles = filesArray.filter((file) => accept.includes(file.type)).map((fileObj) => {
			notify(globalNotification, `The file '${fileObj.name}' was added successfully.`, "success");
			return {
				file: fileObj,
				id: generateGUID(),
				isStreamed: false
			};
		});
		if(validFiles.length > 0) {
			setFiles([...files, ...validFiles]);
		}
	}

	const {
		files: streamedImages,
		setFiles: setStreamedFiles,
		isPending: isStreamingImagesPending,
		streamError: streamError
	} = useFilesStream(autoPartId ? `/api/authenticated/auto-parts/images/${autoPartId}` : "", "image/jpeg");

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
					Array.from([...files, ...(streamError ? [] : streamedImages)]).map((fileObj) => {
						return (
							<div
								key={fileObj.id}
							>
								<img
									src={URL.createObjectURL(fileObj.file)}
									className="width-full margin-top-05rem"
									alt={fileObj.file.name}
								/>
								<Modal
									openButtonTitle={fileObj.isStreamed ? "Delete" : "Remove"}
									closeButtonTitle="Back"
									openButtonClass="width-full secondary-btn text-center"
									closeButtonClass="width-full secondary-btn text-center"
									dialogType="adaptive-modal"
								>
									<p
										className="text-center"
									></p>
								</Modal>
								{/* <Button
									title="Remove"
									className="width-full secondary-btn text-center"
									type="button"
									onClick={async () => {
										if(fileObj.isStreamed) {
											try {
												const response = await fetch(`/api/authenticated/auto-parts/images/delete/${fileObj.id}`, {
													method: "DELETE"
												});
												redirectIfCan(response);
												if(!response.ok) {
													notify(globalNotification, "Something went wrong. The deletion request was unsuccessful.", "danger");
													return;
												}
												setStreamedFiles(streamedImages.filter((f) => f.id !== fileObj.id));
												notify(globalNotification, `The image was successfully deleted from the database.`, "warning");
											}
											catch {
												notify(globalNotification, "Something went wrong with the deletion request.", "danger");
											}
										}
										else {
											setFiles(files.filter((f) => f.id !== fileObj.id));
										}
									}}
								/> */}
							</div>
						);
					})
				}
			</div>
		</Fragment>
	);
}
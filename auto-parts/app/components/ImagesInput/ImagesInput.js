"use client";

import { Fragment, useState, useContext } from "react";
import { Button, Modal } from "@/app/components/Index.js";
import useFilesStream from "@/global-utils/custom-hooks/useFilesStream.js";
import generateGUID from "@/global-utils/GUID/generateGUID.js";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import notify from "@/global-utils/notifications/notify.js";
import onImageDelete from "@/global-utils/component-event-handlers/onImageDelete.js";

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
	const [images, setImages] = useState([]);
	const globalNotification = useContext(NotificationBoxContext);
	function handleFilesChange(filesArray) {
		const validImages = filesArray.filter((file) => accept.includes(file.type)).map((imageObj) => {
			notify(globalNotification, `The file '${imageObj.name}' was added successfully.`, "success");
			return {
				file: imageObj,
				id: generateGUID(),
				isStreamed: false
			};
		});
		if(validImages.length > 0) {
			setImages([...images, ...validImages]);
		}
	}

	const {
		files: streamedImages,
		setFiles: setStreamedImages,
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
					Array.from([...images, ...(streamError ? [] : streamedImages)]).map((imageObj) => {
						return (
							<div
								key={imageObj.id}
							>
								<img
									src={URL.createObjectURL(imageObj.file)}
									className="width-full margin-top-05rem"
									alt={imageObj.file.name}
								/>
								<Modal
									openButtonTitle={imageObj.isStreamed ? "Delete" : "Remove"}
									closeButtonTitle="Back"
									openButtonClass="width-full secondary-btn text-center"
									closeButtonClass="width-full secondary-btn text-center margin-top-05rem"
									dialogType="adaptive-modal"
								>
									<p
										className="text-center"
									>
										Are you sure you want to {imageObj.isStreamed ? "delete" : "remove"} this file?
									</p>
									<Button
										title={imageObj.isStreamed ? "Delete" : "Remove"}
										className="width-full secondary-btn text-center margin-top-05rem"
										type="button"
										onClick={imageObj.isStreamed ? async (e) => {
											await onImageDelete(imageObj, globalNotification, { streamedImages, setStreamedImages });
										} : null}
									/>
								</Modal>
							</div>
						);
					})
				}
			</div>
		</Fragment>
	);
}
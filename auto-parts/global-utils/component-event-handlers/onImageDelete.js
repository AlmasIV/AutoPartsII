import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";
import notify from "@/global-utils/notifications/notify.js";

export default async function onImageDelete(imageObj, globalNotification, streamedImagesState) {
	try {
		const response = await fetch(`/api/authenticated/auto-parts/images/delete/${imageObj.id}`, {
			method: "DELETE"
		});
		redirectIfCan(response);
		if(!response.ok) {
			notify(globalNotification, "Couldn't delete the image. Something went wrong.", "danger");
		}
		else {
			streamedImagesState.setStreamedImages(streamedImagesState.streamedImages.filter((tempImageObj) => tempImageObj.id !== imageObj.id));
			notify(globalNotification, `Successfully deleted ${imageObj.file.name}.`, "success");
		}
	}
	catch {
		notify(globalNotification, "Something went wrong.", "danger");
	}
}
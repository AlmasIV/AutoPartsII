import generateGUID from "@/global-utils/GUID/generateGUID.js";

export default function notify(globalNotification, message, level) {
	globalNotification.setNotifications((prevNotifications) => [
		{
			message,
			level,
			key: generateGUID()
		},
		...prevNotifications
	]);
}
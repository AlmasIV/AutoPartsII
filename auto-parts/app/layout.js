import "@/app/globals.css";

import { NotificationBox } from "@/app/components/Index.js";

export const metadata = {
	title: "Auto-Parts",
	description: "Get good quality auto-parts",
};

export default function RootLayout(
	{
		children
	}
) {
	return (
		<html
			lang="en"
		>
			<body>
				<NotificationBox>
					{children}
				</NotificationBox>
			</body>
		</html>
	);
}
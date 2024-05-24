import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
			<body className={inter.className}>
				{children}
			</body>
		</html>
	);
}
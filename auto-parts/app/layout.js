import "./globals.css";
import { NavBar } from "./components/Index.js";
import Link from "next/link.js";

export const metadata = {
  title: "Auto-Parts",
  description: "Get good quality auto-parts",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>
        <NavBar />
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}

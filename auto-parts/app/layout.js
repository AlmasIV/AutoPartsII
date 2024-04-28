import "./globals.css";
import { NavBar } from "./components/Index.js";

export const metadata = {
  title: "Auto-Parts",
  description: "Get good quality auto-parts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

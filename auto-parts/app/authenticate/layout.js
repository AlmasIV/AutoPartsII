export const metadata = {
  title: "Auto-Parts",
  description: "Get good quality auto-parts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

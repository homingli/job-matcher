import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Matcher",
  description: "Compare a job description against the default resume."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

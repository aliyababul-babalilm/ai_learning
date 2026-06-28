import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bab Al Ilm — AI Mastery Programme",
  description:
    "Master AI with hands-on, interactive training personalized to your job role. Bab Al Ilm: the Gate of Knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

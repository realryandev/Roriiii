import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const space_Grotesk = Space_Grotesk({ subsets:  ['latin'] })

export const metadata: Metadata = {
  title: "Roriiii",
  description: "Made by Ryan for Roriiii",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={space_Grotesk.className}
      >
        {children}
      </body>
    </html>
  );
}

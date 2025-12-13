import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CompareMyPrking.co.uk",
  description: "Airport parking operator admin and booking platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

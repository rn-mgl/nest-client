"use client";

import { AppProvider } from "@/src/utils/context";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "auto",
  variable: "--font-figtree",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <body
          className={`${figtree.className} font-figtree antialiased text-neutral-900 primary-scrollbar`}
        >
          {children}
        </body>
      </AppProvider>
    </html>
  );
}

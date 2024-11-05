"use client";

import { AppProvider } from "@/src/utils/context";
import { Figtree } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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
      <SessionProvider>
        <AppProvider>
          <body
            className={`${figtree.className} w-full h-full font-figtree antialiased text-neutral-900 primary-scrollbar`}
          >
            {children}
          </body>
        </AppProvider>
      </SessionProvider>
    </html>
  );
}

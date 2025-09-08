"use client";

import { ToastProvider } from "@/src/context/ToastContext";
import { SessionProvider } from "next-auth/react";
import { Figtree } from "next/font/google";
import "./globals.css";
import Toasts from "@/src/components/global/popup/Toasts";
import AlertProvider from "@/src/context/AlertContext";
import Alert from "@/src/components/global/popup/Alert";

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
    <SessionProvider>
      <ToastProvider>
        <AlertProvider>
          <html lang="en">
            <body
              className={`${figtree.className} w-full min-h-screen h-screen overflow-y-auto font-figtree antialiased text-neutral-900 primary-scrollbar`}
            >
              <Alert />
              <Toasts />
              {children}
            </body>
          </html>
        </AlertProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

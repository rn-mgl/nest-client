import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Forgot Password | Nest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

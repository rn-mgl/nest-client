import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Nest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

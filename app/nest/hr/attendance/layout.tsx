import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Attendances | HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

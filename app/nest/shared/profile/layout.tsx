import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Profile | Nest",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>;
};

export default RootLayout;

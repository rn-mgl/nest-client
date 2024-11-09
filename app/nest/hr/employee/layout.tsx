import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance | HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

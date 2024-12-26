import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Reviews | HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

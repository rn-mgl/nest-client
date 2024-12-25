import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Review | HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

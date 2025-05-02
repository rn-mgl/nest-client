import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Employee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

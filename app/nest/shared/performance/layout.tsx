import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performances | Employee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

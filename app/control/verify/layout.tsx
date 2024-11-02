import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify | Nest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

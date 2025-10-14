import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendances | Employee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

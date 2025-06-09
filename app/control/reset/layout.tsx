import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Admin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

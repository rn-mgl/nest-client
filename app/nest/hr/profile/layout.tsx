import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Nest HR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

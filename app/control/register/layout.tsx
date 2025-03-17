import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Nest Admin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

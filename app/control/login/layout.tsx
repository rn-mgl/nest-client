import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Nest Admin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

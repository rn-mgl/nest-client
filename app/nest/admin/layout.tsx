import Nav from "@/global/navigation/Nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start">
      <Nav>{children}</Nav>
    </div>
  );
}

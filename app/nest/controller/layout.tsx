import AdminNav from "@/src/components/admin/global/AdminNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <AdminNav>{children}</AdminNav>
    </div>
  );
}

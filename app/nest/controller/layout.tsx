import Nav from "@/src/components/global/Nav";
import { Metadata } from "next";
import { IoApps, IoPeople, IoShieldCheckmark } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

const NAV_LINKS = [
  {
    label: "Dashboard",
    url: "",
    icon: <IoApps />,
  },
  {
    label: "Human Resource",
    url: "/hr",
    icon: <IoPeople />,
  },
  {
    label: "Account Verification",
    url: "/verification",
    icon: <IoShieldCheckmark />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start">
      <Nav home="/nest/controller" navLinks={NAV_LINKS}>
        {children}
      </Nav>
    </div>
  );
}

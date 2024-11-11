import Nav from "@/src/components/global/Nav";
import { Metadata } from "next";
import { IoApps, IoArrowUndo, IoPeople } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Dashboard | HR",
};

const NAV_LINKS = [
  {
    label: "Dashboard",
    url: "",
    icon: <IoApps />,
  },
  {
    label: "Employees",
    url: "/employee",
    icon: <IoPeople />,
  },
  {
    label: "Leaves",
    url: "/leave",
    icon: <IoArrowUndo />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start">
      <Nav home="/nest/hr" navLinks={NAV_LINKS}>
        {children}
      </Nav>
    </div>
  );
}

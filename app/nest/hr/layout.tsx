import Nav from "@/global/navigation/Nav";
import { Metadata } from "next";
import {
  IoApps,
  IoArrowUndo,
  IoFileTray,
  IoFolder,
  IoPeople,
  IoStar,
  IoTrendingUp,
} from "react-icons/io5";

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
    label: "Onboardings",
    url: "/onboarding",
    icon: <IoFileTray />,
  },
  {
    label: "Leaves",
    url: "/leave",
    icon: <IoArrowUndo />,
  },
  {
    label: "Performances",
    url: "/performance",
    icon: <IoStar />,
  },
  {
    label: "Trainings",
    url: "/training",
    icon: <IoTrendingUp />,
  },
  {
    label: "Documents",
    url: "/document/0",
    icon: <IoFolder />,
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

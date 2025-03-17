import Nav from "@/src/components/global/Nav";
import { Metadata } from "next";
import {
  IoApps,
  IoArrowUndo,
  IoCalendar,
  IoFileTray,
  IoFolder,
  IoStar,
  IoTrendingUp,
} from "react-icons/io5";

export const metadata: Metadata = {
  title: "Dashboard | Nest",
};

const NAV_LINKS = [
  {
    label: "Dashboard",
    url: "",
    icon: <IoApps />,
  },
  {
    label: "Attendance",
    url: "/attendance",
    icon: <IoCalendar />,
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
      <Nav home="/nest/employee" navLinks={NAV_LINKS}>
        {children}
      </Nav>
    </div>
  );
}

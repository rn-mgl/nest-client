import { IconType } from "react-icons";
import {
  IoApps,
  IoArrowUndo,
  IoCalendar,
  IoFileTray,
  IoFolder,
  IoKey,
  IoPeople,
  IoPricetags,
  IoSettings,
  IoStar,
  IoTrendingUp,
} from "react-icons/io5";

export const buildNavigation = (
  roles: string[]
): {
  label: string;
  url: string;
  icon: IconType;
}[] => {
  const validRoles = roles.filter((role) => role in ADDITIONAL_NAVIGATION);

  if (validRoles.length === 0) return BASE_NAVIGATION;

  const combinedNavigation = [
    ...BASE_NAVIGATION,
    ...validRoles.flatMap(
      (role) => ADDITIONAL_NAVIGATION[role as keyof object]
    ),
  ];

  return combinedNavigation;
};

const BASE_NAVIGATION = [
  {
    label: "Dashboard",
    url: "",
    icon: IoApps,
  },
  {
    label: "Attendance",
    url: "/attendance",
    icon: IoCalendar,
  },
  {
    label: "Onboardings",
    url: "/onboarding",
    icon: IoFileTray,
  },
  {
    label: "Leaves",
    url: "/leave",
    icon: IoArrowUndo,
  },
  {
    label: "Performances",
    url: "/performance",
    icon: IoStar,
  },
  {
    label: "Trainings",
    url: "/training",
    icon: IoTrendingUp,
  },
  {
    label: "Documents",
    url: "/document?folder=0",
    icon: IoFolder,
  },
];

const ADDITIONAL_NAVIGATION = {
  super_admin: [
    {
      label: "Users",
      url: "/users",
      icon: IoPeople,
    },
    {
      label: "Roles",
      url: "/roles",
      icon: IoPricetags,
    },
    {
      label: "Permissions",
      url: "/permissions",
      icon: IoKey,
    },
  ],
  admin: [
    {
      label: "Human Resources",
      url: "/hr",
      icon: IoSettings,
    },
  ],
  hr: [
    {
      label: "Employees",
      url: "/employee",
      icon: IoPeople,
    },
  ],
};

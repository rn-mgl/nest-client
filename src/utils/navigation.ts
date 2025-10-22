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

// determine navigation based on role
export const buildNavigation = (
  roles: string[]
): {
  label: string;
  url: string;
  icon: IconType;
}[] => {
  // only handle the mappable roles (currently employee, hr, and admin)
  const validRoles = roles.filter((role) => role in ADDITIONAL_NAVIGATION);

  if (validRoles.length === 0) return BASE_NAVIGATION;

  // combine the navigations per roles if a user has multiple roles
  const combinedNavigation = [
    ...BASE_NAVIGATION,
    ...validRoles.flatMap(
      (role) => ADDITIONAL_NAVIGATION[role as keyof object]
    ),
  ];

  return combinedNavigation;
};

// the navigation that every role should have
const BASE_NAVIGATION = [
  {
    label: "Dashboard",
    url: "",
    icon: IoApps,
  },
  {
    label: "Attendance",
    url: "attendance",
    icon: IoCalendar,
  },
  {
    label: "Onboardings",
    url: "onboarding",
    icon: IoFileTray,
  },
  {
    label: "Leaves",
    url: "leave",
    icon: IoArrowUndo,
  },
  {
    label: "Performances",
    url: "performance",
    icon: IoStar,
  },
  {
    label: "Trainings",
    url: "training",
    icon: IoTrendingUp,
  },
  {
    label: "Documents",
    url: "document?path=0",
    icon: IoFolder,
  },
];

// the additional navigation per role
const ADDITIONAL_NAVIGATION = {
  super_admin: [
    {
      label: "Users",
      url: "users",
      icon: IoPeople,
    },
    {
      label: "Roles",
      url: "roles",
      icon: IoPricetags,
    },
    {
      label: "Permissions",
      url: "permissions",
      icon: IoKey,
    },
  ],
  admin: [
    {
      label: "Human Resources",
      url: "hr",
      icon: IoSettings,
    },
  ],
  hr: [
    {
      label: "Employees",
      url: "employee",
      icon: IoPeople,
    },
  ],
};

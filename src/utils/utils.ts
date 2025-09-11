import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
  LeaveTypeInterface,
} from "../interface/LeaveInterface";
import { OnboardingInterface } from "../interface/OnboardingInterface";
import { UserInterface } from "../interface/UserInterface";

export const isUserSummary = (
  value: number | UserInterface
): value is UserInterface => {
  return typeof value === "object" && value !== null;
};

export const isOnboardingSummary = (
  value: number | OnboardingInterface
): value is OnboardingInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveTypeSummary = (
  value: number | LeaveTypeInterface
): value is LeaveTypeInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveBalanceSummary = (
  value: number | LeaveBalanceInterface
): value is LeaveBalanceInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveRequestInterface = (
  value: number | LeaveRequestInterface
): value is LeaveRequestInterface => {
  return typeof value === "string" && value !== null;
};

export const normalizeDate = (
  date: string,
  type?: "date" | "time"
): Date | string => {
  const localDate = new Date(date).toLocaleDateString() ?? "-";
  const localTime = new Date(date).toLocaleTimeString() ?? "-";

  switch (type) {
    case "date":
      return localDate;
    case "time":
      return localTime;
    default:
      return `${localDate} ${localTime}`;
  }
};

export const normalizeString = (value: string): string => {
  const normalized = value
    .split("_")
    .map((s) => `${s[0].toUpperCase()}${s.slice(1, s.length)}`)
    .join(" ");

  return normalized;
};

import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
  LeaveTypeInterface,
} from "@/interface/LeaveInterface";
import { OnboardingInterface } from "@/interface/OnboardingInterface";
import { PerformanceReviewInterface } from "@/interface/PerformanceReviewInterface";
import { UserInterface } from "@/interface/UserInterface";
import { TrainingInterface } from "../interface/TrainingInterface";
import {
  DocumentInterface,
  FolderInterface,
} from "../interface/DocumentInterface";

export const isUserSummary = (
  value: number | object
): value is UserInterface => {
  return typeof value === "object" && value !== null;
};

export const isOnboardingSummary = (
  value: number | object
): value is OnboardingInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveTypeSummary = (
  value: number | object
): value is LeaveTypeInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveBalanceSummary = (
  value: number | object
): value is LeaveBalanceInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveRequestInterface = (
  value: number | object
): value is LeaveRequestInterface => {
  return typeof value === "object" && value !== null;
};

export const isPerformanceReviewSummary = (
  value: number | object
): value is PerformanceReviewInterface => {
  return typeof value === "object" && value !== null;
};

export const isTrainingSummary = (
  value: number | object
): value is TrainingInterface => {
  return typeof value === "object" && value !== null;
};

export const isDocumentSummary = (
  value: object
): value is DocumentInterface => {
  return (
    typeof value === "object" &&
    "description" in value &&
    typeof value.description === "string"
  );
};

export const isFolderSummary = (value: object): value is FolderInterface => {
  return typeof value === "object" && "description"! in value;
};

export const normalizeDate = (date: string, type?: "date" | "time"): string => {
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

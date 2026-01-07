import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
  LeaveTypeInterface,
} from "@/interface/LeaveInterface";
import {
  OnboardingInterface,
  UserOnboardingInterface,
} from "@/interface/OnboardingInterface";
import {
  PerformanceReviewInterface,
  UserPerformanceReviewSurveyResponseInterface,
} from "@/interface/PerformanceReviewInterface";
import { UserInterface } from "@/interface/UserInterface";
import {
  TrainingInterface,
  UserTrainingResponseInterface,
} from "../interface/TrainingInterface";
import {
  DocumentInterface,
  FolderInterface,
} from "../interface/DocumentInterface";
import {
  CloudFileInterface,
  RawFileInterface,
} from "../interface/FileInterface";

export const isUserSummary = (value: unknown): value is UserInterface => {
  return typeof value === "object" && value !== null;
};

export const isOnboardingSummary = (
  value: unknown
): value is OnboardingInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "description" in value &&
    "created_by" in value
  );
};

export const isUserOnboardingSummary = (
  value: unknown
): value is UserOnboardingInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "onboarding_id" in value &&
    "onboarding" in value &&
    isOnboardingSummary(value.onboarding)
  );
};

export const isLeaveTypeSummary = (
  value: unknown
): value is LeaveTypeInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveBalanceSummary = (
  value: unknown
): value is LeaveBalanceInterface => {
  return typeof value === "object" && value !== null;
};

export const isLeaveRequestInterface = (
  value: unknown
): value is LeaveRequestInterface => {
  return typeof value === "object" && value !== null;
};

export const isPerformanceReviewSummary = (
  value: unknown
): value is PerformanceReviewInterface => {
  return typeof value === "object" && value !== null;
};

export const isUserPerformanceReviewResponse = (
  value: unknown
): value is UserPerformanceReviewSurveyResponseInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "response_from" in value &&
    "response" in value &&
    "id" in value &&
    "performance_review_survey_id" in value
  );
};

export const isTrainingSummary = (
  value: unknown
): value is TrainingInterface => {
  return typeof value === "object" && value !== null;
};

export const isUserTrainingResponseSummary = (
  value: unknown
): value is UserTrainingResponseInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "response_from" in value &&
    "training_review_id" in value &&
    "answer" in value
  );
};

export const isDocumentSummary = (
  value: unknown
): value is DocumentInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "description" in value &&
    typeof value.description === "string"
  );
};

export const isFolderSummary = (value: unknown): value is FolderInterface => {
  return typeof value === "object" && value !== null && "description"! in value;
};

export const isRawFileSummary = (value: unknown): value is RawFileInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "rawFile" in value &&
    "fileURL" in value
  );
};

export const isCloudFileSummary = (
  value: unknown
): value is CloudFileInterface => {
  return (
    typeof value === "object" &&
    value !== null &&
    "original_name" in value &&
    "mime_type" in value &&
    "size" in value &&
    "url" in value
  );
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
    .map((s) => `${s[0]?.toUpperCase()}${s.slice(1, s.length)}`)
    .join(" ");

  return normalized;
};

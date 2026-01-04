import { CloudFileInterface, RawFileInterface } from "./FileInterface";
import { UserInterface } from "./UserInterface";

export interface OnboardingInterface {
  id?: number;
  title: string;
  description: string;
  created_by: number | UserInterface;
}

export interface OnboardingRequiredDocumentsInterface {
  id?: number;
  nanoid?: string;
  title: string;
  description: string;
}

export interface OnboardingPolicyAcknowledgemenInterface {
  id?: number;
  nanoid?: string;
  title: string;
  description: string;
}

export interface AssignedOnboarding extends UserInterface {
  assigned_onboarding: null | UserOnboardingInterface;
}

export interface UserOnboardingInterface {
  id?: number;
  onboarding_id: number;
  status: { label: string; value: string | number } | string;
  created_at: string;
  updated_at: string;
  assigned_to: number | UserInterface;
  assigned_by: number | UserInterface;
  onboarding: OnboardingInterface;
  deleted_at: string | null;
}

export interface UserOnboardingRequiredDocumentsInterface {
  id?: number;
  complied_by: number | UserInterface;
  required_document_id: number;
  requirement?: OnboardingRequiredDocumentsInterface;
  document: CloudFileInterface | RawFileInterface | null;
}

export interface UserOnboardingPolicyAcknowledgemenInterface {
  id?: number;
  acknowledged_by: number | UserInterface;
  policy_acknowledgement_id: number;
  acknowledged: boolean;
  policy?: OnboardingPolicyAcknowledgemenInterface;
}

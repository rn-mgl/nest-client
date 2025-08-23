export interface OnboardingInterface {
  onboarding_id?: number;
  title: string;
  description: string;
  created_by?: number;
}

export interface OnboardingRequiredDocumentsInterface {
  onboarding_required_document_id?: number;
  title: string;
  description: string;
}

export interface EmployeeOnboardingRequiredDocumentsInterface {
  user_onboarding_required_document_id?: number;
  document: { rawFile: File; fileURL: string } | string | null;
}

export interface OnboardingPolicyAcknowledgemenInterface {
  onboarding_policy_acknowledgement_id?: number;
  title: string;
  description: string;
}

export interface EmployeeOnboardingPolicyAcknowledgementInterface {
  user_onboarding_policy_acknowledgement_id?: number;
  acknowledged: boolean;
}

export interface EmployeeOnboardingInterface {
  user_onboarding_id?: number;
  status: string;
  created_at?: string;
}

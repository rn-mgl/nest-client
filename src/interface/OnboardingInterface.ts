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
  employee_onboarding_required_document_id?: number;
  document: string | null;
}

export interface OnboardingPolicyAcknowledgemenInterface {
  onboarding_policy_acknowledgement_id?: number;
  title: string;
  description: string;
}

export interface EmployeeOnboardingPolicyAcknowledgementInterface {
  employee_onboarding_policy_acknowledgement_id?: number;
  acknowledged: boolean;
}

export interface EmployeeOnboardingInterface {
  employee_onboarding_id: number | null;
  status: string;
}

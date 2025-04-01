export interface OnboardingInterface {
  onboarding_id?: number;
  title: string;
  description: string;
  created_by?: number;
}

export interface OnboardingRequiredDocumentsInterface {
  onboarding_required_documents_id?: number;
  document: string;
}

export interface OnboardingPolicyAcknowledgemenInterface {
  onboarding_policy_acknowledgements_id?: number;
  policy: string;
}

export interface EmployeeOnboardingInterface {
  employee_onboarding_id: number | null;
  completed_documents: number;
  policy_acknowledged: number;
}

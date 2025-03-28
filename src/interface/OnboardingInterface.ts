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

export interface OnboardingRequiredDocumentSetInterface {
  onboarding_required_documents_id?: number;
  document: string;
}

export interface OnboardingPolicyAcknowledgemenSetInterface {
  onboarding_policy_acknowledgements_id?: number;
  policy: string;
}

export interface OnboardingContentsSetInterface {
  required_documents: Array<OnboardingRequiredDocumentSetInterface>;
  policy_acknowledgements: Array<OnboardingPolicyAcknowledgemenSetInterface>;
}

export interface EmployeeOnboardingInterface {
  employee_onboarding_id: number | null;
}

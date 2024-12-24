export interface OnboardingInterface {
  onboarding_id?: number;
  title: string;
  description: string;
  required_documents: Array<string>;
  policy_acknowledgements: Array<string>;
  created_by?: number;
}

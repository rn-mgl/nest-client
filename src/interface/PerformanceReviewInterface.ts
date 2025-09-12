import { UserInterface } from "./UserInterface";

export interface PerformanceReviewInterface {
  id?: number;
  created_by: number | UserInterface;
  title: string;
  description: string;
}

export interface PerformanceReviewSurveyInterface {
  performance_review_content_id?: number;
  survey: string;
}

export interface EmployeePerformanceReviewInterface {
  user_performance_review_id?: number;
  status: string;
  created_at?: string;
}

export interface EmployeePerformanceReviewResponseInterface {
  user_performance_review_response_id?: number;
  response: string | null;
}

export interface UserPerformanceReviewInterface {
  id?: number;
  performance_review_id: number;
  performance_review: PerformanceReviewInterface;
  assigned_to: number | UserInterface;
  assigned_by: number | UserInterface;
  status: string;
  created_at: string;
}

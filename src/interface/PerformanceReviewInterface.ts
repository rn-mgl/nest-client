export interface PerformanceReviewInterface {
  performance_review_id?: number;
  title: string;
  description: string;
  created_by?: number;
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

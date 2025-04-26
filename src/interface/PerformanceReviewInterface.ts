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
  employee_performance_review_id?: number;
}

export interface EmployeePerformanceReviewResponseInterface {
  employee_performance_review_response_id?: number;
  response: string | null;
}

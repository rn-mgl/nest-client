export interface PerformanceInterface {
  performance_review_id?: number;
  title: string;
  description: string;
  created_by?: number;
}

export interface PerformanceContentInterface {
  performance_review_id?: number;
  performance_review_content_id?: number;
  survey: string;
}

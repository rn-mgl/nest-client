export interface PerformanceReviewInterface {
  performance_review_id?: number;
  title: string;
  description: string;
  created_by?: number;
}

export interface PerformanceReviewContentsInterface {
  surveys: Array<string>;
}

export interface PerformanceReviewSurveysInterface {
  performance_review_content_id?: number;
  survey: string;
}

export interface PerformanceReviewContentInterface {
  contents: Array<PerformanceReviewSurveysInterface>;
}

export interface TrainingInterface {
  training_id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | string | null;
  created_by?: number;
}

export interface TrainingContentInterface {
  training_content_id?: number;
  title: string;
  description: string;
  content: { rawFile: File; fileURL: string } | string;
  type: string;
}

export interface EmployeeTrainingInterface {
  employee_training_id?: number;
  status: string;
  deadline: string;
  score: number | null;
}

export interface TrainingReviewInterface {
  training_review_id?: number;
  training_id?: number;
  question: string;
  answer?: number;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
}

export interface EmployeeTrainingReviewResponseInterface {
  employee_training_review_response_id?: number;
  employee_answer: number;
  is_correct: boolean;
}

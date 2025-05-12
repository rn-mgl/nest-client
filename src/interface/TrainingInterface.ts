export interface TrainingInterface {
  training_id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | string | null;
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
}

export interface TrainingReviewInterface {
  training_review_id?: number;
  training_id?: number;
  question: string;
  answer: number;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
}

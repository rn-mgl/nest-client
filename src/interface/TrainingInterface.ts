import { UserInterface } from "./UserInterface";

export interface TrainingInterface {
  id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | string | null;
  created_by: number | UserInterface;
}

export interface TrainingContentInterface {
  training_content_id?: number;
  title: string;
  description: string;
  content: { rawFile: File; fileURL: string } | string;
  type: string;
}

export interface EmployeeTrainingInterface {
  user_training_id?: number;
  status: string;
  deadline: string;
  score: number | null;
  created_at?: string;
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
  user_training_review_response_id?: number;
  user_answer: number;
  is_correct: boolean;
}

export interface UserTrainingInterface {
  id?: number;
  assigned_to: number | UserInterface;
  assigned_by: number | UserInterface;
  training_id: number;
  status: string;
  score: number | null;
  deadline: string | null;
  created_at: string;
  training: TrainingInterface;
}

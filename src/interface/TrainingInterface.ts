import { CloudFileInterface, RawFileInterface } from "./FileInterface";
import { UserInterface } from "./UserInterface";

export interface TrainingInterface {
  id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: RawFileInterface | CloudFileInterface | null;
  created_by: number | UserInterface;
}

export interface TrainingContentInterface {
  id?: number;
  nanoid?: string;
  title: string;
  description: string;
  content: RawFileInterface | CloudFileInterface | string | null;
  type: "text" | "image" | "video" | "application" | "audio";
}

export interface TrainingReviewInterface {
  id?: number;
  nanoid?: string;
  question: string;
  answer?: number;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
}

export interface AssignedTrainingInterface extends UserInterface {
  assigned_training: null | UserTrainingInterface;
}

export interface UserTrainingInterface {
  id?: number;
  assigned_to: number | UserInterface;
  assigned_by: number | UserInterface;
  training_id: number;
  status: { label: string; value: string } | string;
  score: number | null;
  deadline: string | null;
  created_at: string;
  training: TrainingInterface;
  deleted_at: string | null;
}

export interface UserTrainingResponseInterface {
  id?: number;
  response_from: number;
  training_review_id: number;
  answer: number;
  created_at: "";
  updated_at: "";
  deleted_at: string | null;
}

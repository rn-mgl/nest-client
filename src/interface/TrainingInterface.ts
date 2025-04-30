export interface TrainingInterface {
  training_id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | string | null;
}

export interface TrainingContentSetInterface {
  training_content_id?: number;
  title: string;
  description: string;
  content: { rawFile: File; fileURL: string } | string;
  type: string;
}

export interface TrainingContentsInterface {
  contents: Array<TrainingContentSetInterface>;
}

export interface EmployeeTrainingInterface {
  employee_training_id?: number;
  status: string;
  deadline: string;
}

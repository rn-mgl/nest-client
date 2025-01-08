export interface TrainingInterface {
  training_id?: number;
  title: string;
  deadline_days: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | string | null;
}

export interface TrainingContentsInterface {
  contents: Array<{
    title: string;
    description: string;
    content: { rawFile: File; fileURL: string } | string;
    type: string;
  }>;
}

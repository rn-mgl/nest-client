export interface TrainingInterface {
  title: string;
  deadlineDays: number;
  description: string;
  certificate: { rawFile: File; fileURL: string } | null;
}

export interface TrainingContentsInterface {
  contents: Array<{
    title: string;
    description: string;
    content: { rawFile: File; fileURL: string } | string;
    type: string;
  }>;
}

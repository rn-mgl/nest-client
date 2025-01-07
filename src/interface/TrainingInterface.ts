export interface TrainingInterface {
  title: string;
  description: string;
}

export interface TrainingContentsInterface {
  contents: Array<{
    title: string;
    description: string;
    content: { rawFile: File; fileURL: string } | string;
    type: string;
  }>;
}

export interface TrainingInterface {
  title: string;
  description: string;
}

export interface TrainingContentsInterface {
  contents: Array<{
    title: string;
    description: string;
    content: string;
    type: string;
  }>;
}

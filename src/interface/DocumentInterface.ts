export interface DocumentInterface {
  id?: number;
  name: string;
  description: string;
  path: number;
  document: { rawFile: File | null; fileURL: string } | string;
  created_by?: number;
  type: string;
}

export interface DocumentFolderInterface {
  id?: number;
  name: string;
  path: number;
  created_by?: number;
}

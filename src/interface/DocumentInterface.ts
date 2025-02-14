export interface DocumentInterface {
  id?: number;
  name: string;
  description: string;
  path?: { label: string; value: number } | number;
  document: { rawFile: File; fileURL: string } | string | null;
  created_by?: number;
  type: string;
}

export interface DocumentFolderInterface {
  id?: number;
  name: string;
  path?: { label: string; value: number } | number;
  created_by?: number;
}

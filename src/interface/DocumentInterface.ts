import { UserInterface } from "./UserInterface";

export interface DocumentInterface {
  id?: number;
  title: string;
  description: string;
  path?: { label: string; value: number } | number;
  document: { rawFile: File; fileURL: string } | string | null;
  created_by: number | UserInterface;
}

export interface FolderInterface {
  id?: number;
  title: string;
  path?: { label: string; value: number } | number;
  created_by: number | UserInterface;
}

import { FolderInterface } from "./DocumentInterface";
import { UserInterface } from "./UserInterface";

export interface BaseCardInterface {
  title: string;
  description: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  children: React.ReactNode;
}

export interface BaseActionsInterface {
  handleActiveSeeMore?: () => void;
}

export interface HRActionsInterface {
  handleActiveEdit?: () => void;
  handleActiveAssign?: () => void;
  handleActiveDelete?: () => void;
}

export interface EmployeeCardInterface {
  user: UserInterface;
  children: React.ReactNode;
  sendMail: () => void;
}

export interface FolderCardInterface {
  link: string;
  createdBy: string | null;
  folder: FolderInterface;
  children: React.ReactNode;
}

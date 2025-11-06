import { FolderInterface } from "./DocumentInterface";
import { UserInterface } from "./UserInterface";

export interface BaseCardInterface {
  title: string;
  description?: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  status?: string;
  children: React.ReactNode;
}

export interface BaseActionsInterface {
  handleActiveSeeMore?: () => void;
}

export interface ResourceActionsInterface {
  handleActiveEdit?: (() => void) | null;
  handleActiveAssign?: (() => void) | null;
  handleActiveDelete?: (() => void) | null;
}

export interface UserCardInterface {
  user: UserInterface;
  children: React.ReactNode;
  sendMail: () => void;
}

export interface FolderCardInterface {
  // link: string;
  createdBy: string | null;
  folder: FolderInterface;
  children?: React.ReactNode;
}

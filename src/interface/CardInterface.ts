export interface BaseCardInterface {
  title: string;
  description: string;
  createdBy: string;
  children: React.ReactNode;
}

export interface BaseActionsInterface {
  handleActiveSeeMore?: () => void;
}

export interface HRActionsInterface {
  handleActiveEdit: () => void;
  handleActiveAssign: () => void;
  handleActiveDelete: () => void;
}

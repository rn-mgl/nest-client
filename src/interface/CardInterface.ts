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
  handleCanEdit: () => void;
  handleCanAssign: () => void;
  handleCanDelete: () => void;
}

export interface BaseActionsInterface {
  handleActiveSeeMore?: () => void;
}

export interface HRActionsInterface {
  handleCanEdit: () => void;
  handleCanAssign: () => void;
  handleCanDelete: () => void;
}

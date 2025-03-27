export interface CardInterface {
  activeMenu: boolean;
  createdBy: boolean;
  handleCanEdit: () => void;
  handleCanAssign: () => void;
  handleCanDelete: () => void;
  handleActiveMenu: () => void;
  handleActiveSeeMore?: () => void;
}

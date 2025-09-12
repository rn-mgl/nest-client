export interface CardInterface {
  activeMenu?: boolean;
  createdByCurrentUser: boolean;
  role: string;
  handleCanEdit?: () => void;
  handleCanAssign?: () => void;
  handleCanDelete?: () => void;
  handleActiveMenu?: () => void;
  handleActiveSeeMore?: () => void;
}

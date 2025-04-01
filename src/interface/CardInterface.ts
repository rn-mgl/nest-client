export interface CardInterface {
  activeMenu?: boolean;
  createdBy: boolean;
  role: string;
  handleCanEdit?: () => void;
  handleCanAssign?: () => void;
  handleCanDelete?: () => void;
  handleActiveMenu?: () => void;
  handleActiveSeeMore?: () => void;
}

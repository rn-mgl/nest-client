export interface AlertInterface {
  title: string;
  body: string;
  icon?: React.ReactNode;
  cancelAlert: () => void;
  approveAlert: () => void;
}

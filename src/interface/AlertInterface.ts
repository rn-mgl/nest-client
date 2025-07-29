export interface AlertInterface {
  title: string;
  body: string;
  icon?: React.ReactNode;
  toggleAlert: () => void;
  confirmAlert: () => void;
}

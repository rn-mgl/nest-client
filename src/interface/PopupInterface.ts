export interface ToastInterface {
  subject: string;
  message: string;
  id: string;
  type: "info" | "success" | "warning" | "error";
  percentage: number;
  duration: number;
}

export interface AlertInterface {
  title: string;
  body: string;
  icon?: React.ReactNode;
  confirmAlert: () => Promise<void>;
}

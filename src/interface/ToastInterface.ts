export interface ToastInterface {
  message: string;
  id: number;
  type: "info" | "success" | "warning" | "error";
  active: boolean;
}

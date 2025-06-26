export interface ToastInterface {
  message: string;
  type: "info" | "success" | "warning" | "error";
  active: boolean;
}

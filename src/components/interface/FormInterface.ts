export interface InputString {
  id: string;
  value: string;
  placeholder: string;
  required: boolean;
  type: "text" | "email" | "password";
}

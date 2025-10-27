import { UserInterface } from "./UserInterface";

export interface PermissionInterface {
  id?: number;
  name: string;
  action: string;
  description: string;
  created_by: number | UserInterface;
}

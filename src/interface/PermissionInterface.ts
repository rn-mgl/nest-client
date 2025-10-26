import { UserInterface } from "./UserInterface";

export interface PermissionInterface {
  id?: number;
  description: string;
  created_by: number | UserInterface;
  name: string;
}

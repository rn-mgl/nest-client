import { UserInterface } from "./UserInterface";

export interface RoleInterface {
  id?: number;
  role: string;
  created_by: number | UserInterface;
}

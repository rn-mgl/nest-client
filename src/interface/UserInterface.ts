import { CloudFileInterface, RawFileInterface } from "./FileInterface";

export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  verification_status: "Verified" | "Deactivated";
  email_verified_at?: string | null;
  image?: RawFileInterface | CloudFileInterface | null;
  password?: string;
  created_at?: string;
}

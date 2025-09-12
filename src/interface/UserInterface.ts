export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  verification_status: "Verified" | "Deactivated";
  email_verified_at?: string | null;
  image?: { rawFile: File; fileURL: string } | string | null;
  password?: string;
  created_at?: string;
}

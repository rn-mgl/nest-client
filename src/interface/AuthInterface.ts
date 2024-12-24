export interface RegisterInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

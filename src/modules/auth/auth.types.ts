import { UserRole } from "../users/user.types";
export interface RegisterDTO {
  email: string;
  password: string;
  role: UserRole; // 'student' | 'company' | 'admin' (admin create later)
}
export interface LoginDTO {
  email: string;
  password: string;
}

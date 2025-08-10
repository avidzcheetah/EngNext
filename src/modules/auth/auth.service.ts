import bcrypt from "bcrypt";
import { User } from "../users/user.model";
import { RegisterDTO, LoginDTO } from "./auth.types";
export async function register(data: RegisterDTO) {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw { status: 409, message: "Email already registered" };
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    email: data.email,
    passwordHash,
    role: data.role,
  });
  return user;
}
export async function login(data: LoginDTO) {
  const user = await User.findOne({ email: data.email });
  if (!user) throw { status: 401, message: "Invalid credentials" };
  const ok = await user.comparePassword(data.password);
  if (!ok) throw { status: 401, message: "Invalid credentials" };
  return user;
}

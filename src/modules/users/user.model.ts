// src/modules/users/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole } from './user.types';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true, // enforce unique email
      required: true,
      index: true, // fast lookup by email
      lowercase: true,
      trim: true
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'company', 'admin'], required: true, index: true }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);

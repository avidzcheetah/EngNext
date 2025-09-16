// models/Admin.js
import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// ✅ Correct model name
export default model("adminSchema", adminSchema);

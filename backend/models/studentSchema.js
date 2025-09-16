// models/Student.js
import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password:{
    type:String,
    required:true,
  },
  phone: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
   profilePicture: {
    data: Buffer,
    contentType: String, // "image/jpeg" / "image/png"
    filename: String,
    uploadDate: { type: Date, default: Date.now }
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String], // array of skills
    default: [],
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4, // assuming GPA scale is 0 - 4
  },
  year: {
    type: String, // e.g. "First Year", "Second Year"
   
  },
  registrationNumber: {
    type: String,
    
  },
  
  portfolio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  cv: {
    data: Buffer,
    contentType: String, // "application/pdf"
    filename: String,
    uploadDate: { type: Date, default: Date.now }
  },
  interestLevel: {
    type: Number
  },
  // ✅ New fields
  profileCompletion: {
    type: Number,
    default: 0,
  },
  RecentNotifications: {
    type: [String],
    default: [],
  },
  ApplicationsSent: {
    type: Number,
    default: 0,
  },
  ProfileViews: {
    type: Number,
    default: 0,
  },
  Interviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // auto adds createdAt & updatedAt
});

// ✅ Correct model name
export default model("studentSchema", studentSchema);

